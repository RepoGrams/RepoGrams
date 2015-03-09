#!/usr/bin/env python2
# -!- encoding: utf-8

from __future__ import print_function

from utils import debug, PriorityQueue, Order
import githelpers as gh
import json
import os.path
import collections
import itertools

import graph_tool as gt
import graph_tool.topology

import jellyfish
import numpy

from distutils.version import LooseVersion

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

    def __init__(self, git_helper, cache, precompute = False):
        self.cache = cache
        self.git_helper = git_helper
        self.precompute = precompute
        self.graph = gt.Graph()
        # required to map a nodes hashsum back to the vertex
        self.hash2vertex = {}

        # properties associated with each commit
        self.vertex2commit = self.graph.new_vertex_property("object")
        self.commit_hashsum = self.graph.new_vertex_property("string")
        self.commit_msg = self.graph.new_vertex_property("object")
        self.commit_timestamp = self.graph.new_vertex_property("string")
        self.commit_files = self.graph.new_vertex_property("vector<string>")
        self.commit_churn = self.graph.new_vertex_property("int")
        self.branch_complexity = self.graph.new_vertex_property("int")
        self.commit_author = self.graph.new_vertex_property("int")
        self.associated_branch = self.graph.new_vertex_property("int")
        self.commit_age = self.graph.new_vertex_property("int")
        self.commit_parents = self.graph.new_vertex_property("int")

        # sentinel: required to have a rooted DAG
        self.sentinel = self.graph.add_vertex()
        self.commit_hashsum[self.sentinel] = "SENTINEL"
        self.hash2vertex["SENTINEL"] = self.sentinel

        # construct the graph
        for commit in self.git_helper.get_all_commits():
            parents, commit_timestamp, commitmsg, added, removed, files = self.git_helper.get_commit_data(commit)
            commit_vertex = self.graph.add_vertex()
            self.vertex2commit[commit_vertex] = commit
            self.hash2vertex[str(commit.oid)] = commit_vertex
            self.commit_hashsum[commit_vertex] = str(commit.oid)
            self.commit_msg[commit_vertex] = commitmsg
            self.commit_timestamp[commit_vertex] = commit_timestamp
            self.commit_files[commit_vertex] = files
            self.commit_churn[commit_vertex] = added+removed
            self.branch_complexity[commit_vertex] = 0
            self.commit_author[commit_vertex] = 0
            self.commit_age[commit_vertex] = 0
            self.commit_parents[commit_vertex] = len(parents)
            if not parents:
                debug("initial commit detected: {}".format(commit))
                self.graph.add_edge(self.sentinel, commit_vertex)
                continue
            for parent in parents:
                debug("adding edge from {} to {}".format(parent, commit))
                self.graph.add_edge(self.hash2vertex[str(parent.oid)], commit_vertex)
        assert gt.topology.is_DAG(self.graph)

        # compute dominators
        self.dominator_tree = self.compute_dominators()

        # get the branch heads for metric 4
        master_sha, branch_heads = git_helper.get_branch_heads()
        self.master_sha = str(master_sha)
        self.branch_heads = map(str, branch_heads)
        self.metric4()
        self.metric6()
        self.metric_commit_author()
        self.metric_commit_age()

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
        assoc_branch = self.associated_branch[commit_node]
        # By excluding the child from the same branch, we avoid the issue that it not
        # necessaryly dominated.
        # An example for this is efea0f23f9e0f147c5ff5b5d35249417c32c3a53 from jQuery
        for child in children:
            if (commit_node == self.graph.vertex(self.dominator_tree[child]) and
                self.associated_branch[child] != assoc_branch): # exclude child from same branch
                branch_counter += 1
        # There are actually commits with multiple children which dominate none
        # of them, in this case branch_counter becomes negative because of the
        # last line, adjusting for the "main" branch; therefore we have to reset
        # branch_counter to zero
        # An example of such a commit is 738036395d68824933949186603aeeb9c087d10e
        # of the repograms repository
        branch_counter = max(branch_counter, 0)
        assert branch_counter >= 0, "A negative number of branches cannot exist: branch_counter: {}, #children: {}, commit: {}".format(branch_counter, len(children), commit_node)
        if __debug__:
            if branch_counter != 0:
                debug("started:", self.commit_hashsum[commit_node])
            else:
                debug("not started:", self.commit_hashsum[commit_node])
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
            # TODO: not in parents is not sufficiant
            # we need to check if is there is a path from child to parents -
            # parent
            destinies = set(parents)
            destinies.remove(parent)
            parent_counter = 0
            for child in parent.out_neighbours():
                if child == commit_node:
                    continue
                parent_counter += sum(1 for destiny in destinies
                                        if (child == destiny or
                                            gt.topology.shortest_path(self.graph, child, destiny)[0]))
            child_count = sum(1 for _ in parent.out_neighbours())
            if child_count - parent_counter  == 1:
                # commit_node is the last commit of the branch
                ended_counter += 1
        ended_counter -= 1  # one parent is from the "main" branch
        # A merge commit might not end any branch, e.g. commit
        # 9b0235dd7ca88fa1f5a83552b457bf95b6de6f73
        # of the bootstrap repository
        # Therefore we set the counter to 0 if it's negative
        ended_counter = max(ended_counter, 0)
        assert ended_counter >= 0, "commit cannot end negative number of branches: branch_counter: {}, #parents: {}, commit: {}".format(ended_counter, len(parents), self.commit_hashsum[commit_node])
        if __debug__:
            if ended_counter != 0:
                debug("ended:", self.commit_hashsum[commit_node], "number: ", ended_counter)
            else:
                debug("not ended:", self.commit_hashsum[commit_node])
                debug("parents are")
                for parent in parents:
                    debug("\t",self.commit_hashsum[parent])
                    for child in parent.out_neighbours():
                        debug("\t\tchild: ", self.commit_hashsum[child])
                        debug("")
        return ended_counter

    def metric6(self):
        branch_counter = 0
        for commit_node in self.iterate_commits(Order.TOPO):
            # iterate over commits in order of commit_timestamps
            debug(self.commit_hashsum[commit_node])
            parents = list(commit_node.in_neighbours())
            children = list(commit_node.out_neighbours())
            if parents[0] == self.sentinel:  # first commit of branch
                assert(len(parents) == 1), "First commit of branch has no predecessor"
                branch_counter += 1
            branch_counter -= self._ended_branches_count(commit_node, parents)
            assert branch_counter >= 1, "There should be at least one branch all the time: branch_counter: {}, commit {}: ".format(branch_counter, self.commit_hashsum[commit_node])
            self.branch_complexity[commit_node] = branch_counter
            # add the newly created branches AFTERWARDS
            # the branches diverge at this commit, but the number of branches
            # is only increased in the children
            branch_counter += self._created_branches_count(commit_node,
                                                           children)
            assert branch_counter >= 1,"There should be at least one branch all the time: branch_counter: {}, commit {}: ".format(branch_counter, self.commit_hashsum[commit_node])
        # visited all nodes

    def metric4(self):
        # utility function to get the equivalent of Python 3's tuple unpacking
        def splitl(head, *tail):
            return head, tail
        workqueue = [self.hash2vertex[self.master_sha]]
        workqueue += (self.hash2vertex[shasum] for shasum in self.branch_heads if shasum != self.master_sha)
        # add all sinks; this seems to be necessary in some special cases
        for v in self.graph.vertices():
            if v.out_degree() == 0:
                workqueue.append(v)
        branch_id = 1
        while workqueue:
            current = workqueue.pop(0)
            # check if the commit was not visited yet (associated_branch is 0)
            # and if we're not done
            while (self.associated_branch[current] == 0 and current != self.sentinel):
                self.associated_branch[current] = branch_id
                # update current element for next iteration
                current, todo = splitl(*current.in_neighbours())
                # add remaining items to workqueue, they are from a different
                # branch
                workqueue += todo
            branch_id += 1

    def metric_commit_author(self):
        """Computes a unique numeric ID for each commit author, based on email address."""

        authors = []
        for commit_vertex in self.iterate_commits():
            author_email = self.vertex2commit[commit_vertex].author.email
            if author_email not in authors:
                authors.append(author_email)
            self.commit_author[commit_vertex] = authors.index(author_email)

    def metric_commit_age(self):
        """Computes the age of the commit, based on the lowest time difference between the commit and any of its
        parents."""

        for commit_vertex in self.iterate_commits():
            commit = self.vertex2commit[commit_vertex]
            parent_distances = [commit.commit_time - parent.commit_time for parent in commit.parents]
            self.commit_age[commit_vertex] = min(parent_distances) if parent_distances else 0


    def commit_lang_compl(self, name_mapping, extension_mapping):
        """Computes the commit language complexity
           @name_mapping: a  mapping from file names to file types
           @name_mapping: a  mapping from file extensions to file types
           @returns: number of different file types of the commits
                     (in chronological order)
        """
        result = []
        for commit in self.iterate_commits():
            file_type_counter = collections.Counter()
            for f in self.commit_files[commit]:
                filename = f
                try:
                    filetype = name_mapping[filename]
                except KeyError:
                    try:
                        # [1] is the extension with dot, [1:] removes the dot
                        fileext = os.path.splitext(f)[1][1:]
                        filetype = extension_mapping[fileext]
                    except KeyError:
                        filetype = "Other"
                file_type_counter[filetype] += 1
            result.append(len(file_type_counter))
        return result

    def most_edit_file(self):
        """ Computes number of  edits to the most edited file
        @returns number of edits to most edited file
        """
        result = []
        file_modified_counter = collections.Counter()
        for commit in self.iterate_commits():
            metric_value = 0
            for f in self.commit_files[commit]:
                file_modified_counter[f] += 1
                if file_modified_counter[f] > metric_value:
                    metric_value = file_modified_counter[f]
            result.append(max(0, metric_value-1))
        return result

    def commit_message_length(self):
        result = []
        for commit in self.iterate_commits():
            message = self.commit_msg[commit]
            result.append(len(message.strip().split()))
        return result

    def commit_modularity(self):
        """Computes the the number of modules modified by a commit
        @returns: a list containing the result
        """
        result = []
        for commit in self.iterate_commits():
            paths = map(os.path.dirname, self.commit_files[commit])
            if len(paths) <= 1:
                result.append(len(paths))
                continue
            similarity_scores = []
            for pair_of_files in itertools.combinations(paths, 2):
                distance = jellyfish.jaro_winkler(*pair_of_files)
                similarity_scores.append(distance)
            result.append(numpy.mean(similarity_scores))
        return result

    def pom_files(self):
        """Computes the number of pom.xml files that were modified in a commit
        @:returns: a list containing the result
        """

        result = []
        for commit in self.iterate_commits():
            pom_files_changed = sum(1 for f in self.commit_files[commit] if os.path.basename(f) == 'pom.xml')
            result.append(pom_files_changed)
        return result

    def files_modified(self):
        """Computes the number of files modifed in a particular commit
        @:returns: a list containg an integer pertaining to the number of files modifid in a commit
        """
        result = []
        for commit in self.iterate_commits():
            files_modified_in_commit = sum(1 for f in self.commit_files[commit])
            result.append(files_modified_in_commit)
        return result

    def merge_indicator(self):
        """Determines if a commit invlolved a merge, and marks the corresponding commit
        @:returns
        """
        result = []
        for commit in self.iterate_commits():
            merge_occured = 0
            if self.commit_parents[commit] == 2:    #two parents case
                merge_occured = 1
            elif self.commit_parents[commit] > 2:
                merge_occured = 2
            result.append(merge_occured)
        return result
        

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
        our_version = LooseVersion(gt.__version__.split()[0])
        if our_version >= version_where_topological_sort_behaves_as_expected:
            commits = gt.topology.topological_sort(self.graph)
        else:
            commits = reversed(gt.topology.topological_sort(self.graph))
        for commit_index in commits:
            commit_node = self.graph.vertex(commit_index)
            debug("Current element", self.commit_hashsum[commit_node])
            if (commit_node == self.sentinel):
                # we got the sentinel node, which is not a real commit node
                continue
            yield commit_node

    def iterate_chrono(self):
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

    def export(self):
        checksums = []
        churns = []
        commit_messages = []
        files = []
        associated_branches = []
        commit_author = []
        bcomplexities = []
        commit_age = []
        for commit in self.iterate_commits():
            assert self.associated_branch[commit] != 0, "{}".format(self.commit_msg[commit])
            checksums.append(self.commit_hashsum[commit])
            churns.append(self.commit_churn[commit])
            commit_messages.append(self.commit_msg[commit])
            files.append(list(self.commit_files[commit]))
            associated_branches.append(self.associated_branch[commit])
            commit_author.append(self.commit_author[commit])
            bcomplexities.append(self.branch_complexity[commit])
            commit_age.append(self.commit_age[commit])
        result = {
            "checksums": checksums,
            "churns": churns,
            "commit_messages": commit_messages,
            "files": files,
            "associated_branches": associated_branches,
            "commit_author": commit_author,
            "bcomplexities": bcomplexities,
            "commit_age": commit_age,
            "precomputed": self.precompute
        }
        if self.precompute:
            with open("js/metrics/filenames.json") as f:
                data = json.load(f)
            name_mapping = dict(itertools.izip(data["NAMES"], data["TYPES"]))
            extension_mapping = dict(itertools.izip(data["ENDINGS"], data["TYPE"]))
            result["commit_lang_compl"] = self.commit_lang_compl(name_mapping, extension_mapping)
            result["most_edit_file"] = self.most_edit_file()
            result["commit_message_length"] = self.commit_message_length()
            result["commit_modularity"] = self.commit_modularity()
            result["pom_files"] = self.pom_files()
            result["files_modified"] = self.files_modified()
            result["merge_indicator"] = self.merge_indicator()
        self.cache[self.git_helper.repo_url] = result
        return result

    def export_as_json(self):
        result = self.export()
        return json.dumps(result, separators=(',', ':'))

def print_error(message):
    print(json.dumps({"emessage": message}, separators=(',', ':')))
