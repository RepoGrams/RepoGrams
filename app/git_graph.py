#!/usr/bin/env python3
# -!- encoding: utf-8

import json
from distutils.version import LooseVersion

import graph_tool
import graph_tool.topology

from app import git_helpers
from metrics import active_metrics
from utils import PriorityQueue, Order


class GitGraphCache(object):
    def __init__(self):
        self._cache = {}

    def __setitem__(self, key, value):
        self._cache[key] = value

    def __getitem__(self, key):
        return self._cache[key]

    def __contains__(self, key):
        return key in self._cache


class GitGraph(object):
    def __init__(self, git_helper):
        self.git_helper = git_helper
        self.graph = graph_tool.Graph()
        # required to map a nodes hashsum back to the vertex
        self.hash2vertex = {}

        # properties associated with each commit
        self.vertex2commit = self.graph.new_vertex_property("object")
        self.commit_hashsum = self.graph.new_vertex_property("string")
        self.commit_message = self.graph.new_vertex_property("object")
        self.commit_timestamp = self.graph.new_vertex_property("string")
        self.commit_files = self.graph.new_vertex_property("vector<string>")
        self.commit_churn = self.graph.new_vertex_property("int")

        self.associated_branch = self.graph.new_vertex_property("int")

        # sentinel: required to have a rooted DAG
        self.sentinel = self.graph.add_vertex()
        self.commit_hashsum[self.sentinel] = "SENTINEL"
        self.hash2vertex["SENTINEL"] = self.sentinel

        # construct the graph
        for commit in self.git_helper.get_all_commits():
            commit_vertex = self.graph.add_vertex()
            self.vertex2commit[commit_vertex] = commit
            self.hash2vertex[str(commit.oid)] = commit_vertex
            self.commit_hashsum[commit_vertex] = str(commit.oid)
            self.commit_message[commit_vertex] = commit.message
            self.commit_timestamp[commit_vertex] = commit.commit_time
            self.commit_churn[commit_vertex], self.commit_files[commit_vertex] = git_helpers.get_patch_data(commit)
            if not commit.parents:
                self.graph.add_edge(self.sentinel, commit_vertex)
                continue
            for parent in commit.parents:
                self.graph.add_edge(self.hash2vertex[str(parent.oid)], commit_vertex)
        assert graph_tool.topology.is_DAG(self.graph)

        # compute dominators and associated branches
        self.dominator_tree = self.compute_dominator_tree()
        self.associate_branches()

        # Calculate the metrics
        self.commit_metrics = {}
        for metric in active_metrics:
            self.commit_metrics[metric.id] = metric(self)

    def compute_dominator_tree(self):
        """Compute the dominator set from the dominator tree"""
        return graph_tool.topology.dominator_tree(self.graph, self.sentinel)

    def associate_branches(self):
        master_sha, branch_heads = self.git_helper.get_branch_heads()
        master_sha, branch_heads = str(master_sha), [str(branch_head) for branch_head in branch_heads]

        # utility function to get the equivalent of Python 3's tuple unpacking
        unpack = lambda head, *tail: (head, tail)

        work_queue = [self.hash2vertex[master_sha]]
        work_queue += (self.hash2vertex[sha_sum] for sha_sum in branch_heads if sha_sum != master_sha)
        # add all sinks; this seems to be necessary in some special cases
        for v in self.graph.vertices():
            if v.out_degree() == 0:
                work_queue.append(v)
        branch_id = 1
        while work_queue:
            current = work_queue.pop(0)
            # check if the commit was not visited yet (associated_branch is 0)
            # and if we're not done
            while self.associated_branch[current] == 0 and current != self.sentinel:
                self.associated_branch[current] = branch_id
                # update current element for next iteration
                current, todo = unpack(*current.in_neighbours())
                # add remaining items to work_queue, they are from a different
                # branch
                work_queue += todo
            branch_id += 1

    def iterate_commits(self, order=Order.CHRONO):
        if order == Order.TOPO:
            for commit_node in self.iterate_topo():
                yield commit_node
        elif order == Order.CHRONO:
            for commit_node in self.iterate_chrono():
                yield commit_node

    def iterate_topo(self):
        # topological_sort: if edge (u,v) appears in the graph, then v
        # comes before u in the ordering
        # we want however the reverse ordering (which is what people in
        # general understand by topological order)
        version_where_topological_sort_behaves_as_expected = LooseVersion('2.2.36')
        our_version = LooseVersion(graph_tool.__version__.split()[0])
        if our_version >= version_where_topological_sort_behaves_as_expected:
            commits = graph_tool.topology.topological_sort(self.graph)
        else:
            commits = reversed(graph_tool.topology.topological_sort(self.graph))
        for commit_index in commits:
            commit_node = self.graph.vertex(commit_index)
            if commit_node == self.sentinel:
                # we got the sentinel node, which is not a real commit node
                continue
            yield commit_node

    def iterate_chrono(self):
        unvisited_nodes = PriorityQueue()
        already_seen = set()
        for initial_commit in self.sentinel.out_neighbours():
            unvisited_nodes.push(initial_commit, self.commit_timestamp[initial_commit])
            already_seen.add(initial_commit)
        while True:
            # iterate over commits in order of commit_timestamps
            try:
                commit_node = unvisited_nodes.pop()
            except IndexError:
                return
            yield commit_node
            children = commit_node.out_neighbours()
            new_nodes = [child for child in children if child not in already_seen]
            for node in new_nodes:
                unvisited_nodes.push(node, self.commit_timestamp[node])
            already_seen |= set(new_nodes)

    def export(self):
        return self.commit_metrics


def print_error(message):
    print(json.dumps({"emessage": message}, separators=(',', ':')))
