#!/usr/bin/env python2
# -!- encoding: utf-8

from __future__ import print_function

import subprocess
# import itertools
import collections
import heapq
import json

import networkx as nx
import graph_tool as gt
import graph_tool.topology


debug = lambda x: None


class PriorityQueue:
    """A priority queue. Returs elements with lower priority first"""
    def __init__(self):
        self._queue = []
        self._index = 0

    def push(self, item, priority):
        heapq.heappush(self._queue, (priority, self._index, item))
        self._index += 1

    def pop(self):
        return heapq.heappop(self._queue)[-1]


def get_commit_data(commit_id):
    # iterate over commits
    # --always: handle empty commits
    # -s: don't show p, we do it later
    # --root: else the first commit won't work
    # -r: the commit we want to display
    # --pretty: format string which prints all we need
    #   %P: parents   |   %ct: commiter time stamp     | %B commitmsg
    separator = "\a"
    command = """git diff-tree --always --root --no-commit-id --numstat --pretty=format:{1}%P{1}%ct{1}%B{1} -r {0}""".format(commit_id, separator)
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    filestats, parents, commit_timestamp, commitmsg, _ = out.decode('utf8', 'ignore').split(separator)
    lines_added = 0
    lines_removed = 0
    file_names = []
    for file_info in filestats.split("\n"):
        if file_info:
            added, removed, name = file_info.split("\t")
            try:
                lines_added += int(added)
                lines_removed += int(removed)
            except ValueError:
                pass  # binary files don't have those numbers
            # TODO: deal with renames!
            file_names.append(name)
    return (parents.split(), commit_timestamp, commitmsg,
            lines_added, lines_removed, file_names)


def get_all_commits():
    command = """git rev-list --branches --reverse"""
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    all_commits = out.decode('utf8', 'ignore').split("\n")[:-1]
    return all_commits


class GitGraph():

    def __init__(self):
        self.graph = gt.Graph()
        # required to map a nodes hashsum back to the vertex
        self.hash2vertex = {}

        # properties associated with each commit
        self.commit_hashsum = self.graph.new_vertex_property("string")
        self.commit_msg = self.graph.new_vertex_property("string")
        self.commit_timestamp = self.graph.new_vertex_property("string")
        self.commit_files = self.graph.new_vertex_property("vector<string>")
        self.commit_churn = self.graph.new_vertex_property("int")
        self.branch_complexity = self.graph.new_vertex_property("int")

        # sentinel: required to have a rooted tree
        self.sentinel = self.graph.add_vertex()
        self.commit_hashsum[self.sentinel] = "SENTINEL"
        self.hash2vertex["SENTINEL"] = self.sentinel

        # construct the graph
        for commit in get_all_commits():
            parents, commit_timestamp, commitmsg, added, removed, files = get_commit_data(commit)
            commit_vertex = self.graph.add_vertex()
            self.hash2vertex[commit] = commit_vertex
            self.commit_hashsum[commit_vertex] = commit
            self.commit_msg[commit_vertex] = commitmsg
            self.commit_timestamp[commit_vertex] = commit_timestamp
            self.commit_files[commit_vertex] = files
            self.commit_churn[commit_vertex] = added+removed
            self.branch_complexity[commit_vertex] = 0
            if not parents:
                self.graph.add_edge(self.sentinel, commit_vertex)
                continue
            for parent in parents:
                self.graph.add_edge(self.hash2vertex[parent], commit_vertex)
        assert gt.topology.is_DAG(self.graph)

        # compute dominators
        self.dominator_tree = self.compute_dominators()

    def compute_dominators(self):
        """
        Compute the dominator set from the dominator tree
        """
        domtree = gt.topology.dominator_tree(self.graph, self.sentinel)
        return domtree

    def _created_branches_count(self, commit_node, children):
        """
        Returns the number of new branches a commit creates
        Consider
        A---B---D--F---...
        \        /
         \--C---E---G---...
        here E will have two children, F and G
        However, it doesn't create a new branch, because it was already
        created by A
        To fix this, we increase the counter
        ifF the commit dominates it children
        """
        if not len(children) > 1:
            return 0
        branch_counter = 0
        for child in children:
            if commit_node == self.graph.vertex(self.dominator_tree[child]):
                branch_counter += 1
        branch_counter -= 1  # one child is from the "main" branch
        # There are actually commits with multiple children which dominate none
        # of them, in this case branch_counter becomes negative because of the
        # last line, adjusting for the "main" branch; therefore we have to reset
        # branch_counter to zero
        # An example of such a commit is 738036395d68824933949186603aeeb9c087d10e
        # of the repograms repository
        branch_counter = max(branch_counter, 0)
        assert branch_counter >= 0, "A negative number of branches cannot exist: branch_counter: {}, #children: {}, commit: {}".format(branch_counter, len(children), commit_node)
        return branch_counter

    def _ended_branches_count(self, commit_node, parents):
        if not len(parents) > 1:
            return 0
        """
        Consider
        A------C--D--F (master)
          \    /
            \--B-----E  (feature branch)
        In this case, C has multiple parents
        However, it is NOT the end of a branch, as the feature
        branch is still continued (by commit E)
        To respect this, we only substract one from the counter for
        each parent with only one child
        """
        ended_counter = 0
        for parent in parents:
            if len(parent.out_neighbours()) == 1:
                # commit_node is the last commit of the branch
                ended_counter += 1
        ended_counter -= 1  # one parent is from the "main" branch
        assert ended_counter >= 0, "commit cannot end negative number of branches: branch_counter: {}, #children: {}".format(branch_counter, len(children))
        return ended_counter


    def metric6(self):
        branch_counter = 0
        result = []
        for commit_node in self.iterate_commits():
            # iterate over commits in order of commit_timestamps
            debug(commit_node)
            parents = list(commit_node.in_neighbours())
            children = list(commit_node.out_neighbours())
            if parents[0] == self.sentinel:  # first commit of branch
                assert(len(parents) == 1), "First commit of branch has no predecessor"
                branch_counter += 1
            branch_counter += self._created_branches_count(commit_node,
                                                           children)
            branch_counter -= self._ended_branches_count(commit_node, parents)
            result.append((1, branch_counter))
            self.branch_complexity[commit_node] = branch_counter
        # visited all nodes
        return result

    def iterate_commits(self):
        unvisited_nodes = PriorityQueue()
        already_seen = set()
        for initial_commit in self.sentinel.out_neighbours():
            unvisited_nodes.push(initial_commit, self.commit_timestamp[initial_commit])
            already_seen.add(initial_commit)
        while(True):
            # iterate over commits in order of commit_timestamps
            try:
                commit_node = unvisited_nodes.pop()
            except IndexError:
                raise StopIteration
            yield commit_node
            children = commit_node.out_neighbours()
            new_nodes = [child for child in children if child not in already_seen]
            for node in new_nodes:
                unvisited_nodes.push(node, self.commit_timestamp[node])
            already_seen |= set(new_nodes)

    def export_as_json(self):
        result = []
        for commit in self.iterate_commits():
            result.append({
                "churn": self.commit_churn[commit],
                "commitmsg": self.commit_msg[commit],
                "files": list(self.commit_files[commit]),
                "bcomplexity": self.branch_complexity[commit],
            })
        return json.dumps(result, separators=(',', ':'))


if __name__ == "__main__":
    import sys
    import os
    import tempfile
    if len(sys.argv) < 1:
        print("missing argument")
        sys.exit(0)
    dirpath = tempfile.mkdtemp()
    os.chdir(dirpath)
    command = "git clone {} .".format(sys.argv[1])
    subprocess.check_call(command.split())
    g = GitGraph()
    g.metric6()
    exported = g.export_as_json()
    print(exported)
