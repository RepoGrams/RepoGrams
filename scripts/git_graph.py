#!/usr/bin/env python2
# -!- encoding: utf-8

from __future__ import print_function

import subprocess
# import itertools
import collections
import heapq

import networkx as nx


class PriorityQueue:
    """A priority queue. Returs elements with __lower__ first"""
    def __init__(self):
        self._queue = []
        self._index = 0

    def push(self, item, priority):
        heapq.heappush(self._queue, (priority, self._index, item))
        self._index += 1

    def pop(self):
        return heapq.heappop(self._queue)[-1]


def list_children(commit_id):
    """Returns the ids of all children of a given commit
    :commit_id: the commit for which you want to obtain the children"""
    command = """git rev-list --all --not {0}^@ --children""".format(commit_id)
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    for line in pipe.stdout:
        line = line.decode('utf8', 'ignore').strip()
        if line.startswith(commit_id):
            return line.split(" ")[1:]
    return []


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
    list_children("HEAD")
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    all_commits = out.decode('utf8', 'ignore').split("\n")[:-1]
    return all_commits


class GitGraph():

    def __init__(self):
        self.graph = nx.DiGraph()
        self.sentinel = "SENTINEL"
        self.graph.add_node(self.sentinel, {"commitmsg": "SENTINEL"})
        for commit in get_all_commits():
            parents, commit_timestamp, commitmsg, added, removed, files = get_commit_data(commit)
            self.graph.add_node(commit, {
                "commitmsg": commitmsg,
                "commit_timestamp": commit_timestamp,
                "file_list": files,
                "churn": added+removed,
            })
            if not parents:
                self.graph.add_edge(self.sentinel, commit)
                continue
            for parent in parents:
                self.graph.add_edge(parent, commit)
        self.dominators = self.compute_dominators()

    def plot(self):
        import matplotlib.pyplot as plt
        nx.draw(self.graph)
        plt.show()

    def compute_dominators(self):
        """
        Compute the dominators

        dominators(root) = {root}
        dominators(x) = {x} ∪ (∩ dominators(y) for y ∈ preds(x))
        """
        # TODO: this is rather slow, one should rather use
        # Cooper, Keith D.; Harvey, Timothy J; and Kennedy, Ken (2001).
        # "A Simple, Fast Dominance Algorithm".

        # initialize the dominator sets
        dominators = collections.defaultdict(set)  # { block : {dominators} }
        for node in self.graph.nodes_iter():
            dominators[node] = set(self.graph.nodes())

        # first block is only dominated by itself
        dominators[self.sentinel] = set([self.sentinel])
        changed = True
        while (changed):
            changed = False
            for node in self.graph.nodes_iter():
                if node == self.sentinel:
                    continue
                pred_doms = [dominators[pred] for pred
                             in self.graph.predecessors(node)]
                new_doms = set([node]) | set.intersection(*(pred_doms or [set()]))
                if (new_doms != dominators[node]):
                    dominators[node] = new_doms
                    changed = True

        # TODO

        return dominators

    def metric6(self):
        branch_counter = 0
        unvisited_nodes = PriorityQueue()
        already_seen = set()
        for initial_commit in self.graph.successors_iter(self.sentinel):
            unvisited_nodes.push(initial_commit, self.graph.node[initial_commit]["commit_timestamp"])
            already_seen.add(initial_commit)
        result = []
        try:
            while(True):
                # iterate over commits in order of commit_timestamps
                commit_node = unvisited_nodes.pop()
                parents = self.graph.predecessors(commit_node)
                children = self.graph.successors(commit_node)
                new_nodes = [child for child in children if child not in already_seen]
                for node in new_nodes:
                    unvisited_nodes.push(node, self.graph.node[node]["commit_timestamp"])
                already_seen |= set(new_nodes)
                if parents[0] == self.sentinel:  # first commit of branch
                    branch_counter += 1
                if (len(children) > 1):  # commit starts one or more new branches
                    """
                    Consider
                    A---B---D--F---...
                    \         /
                    \--C---E---G---...
                    here E will have two children, F and G
                    However, it doesn't create a new branch, because it was already
                    created by A
                    To fix this, we increase the counter
                    ifF the commit dominates it children
                    """
                    for child in children:
                        if commit_node in self.dominators[child]:
                            branch_counter += 1
                    branch_counter -= 1  # one child is from the "main" branch
                if len(parents) > 1:
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
                    for parent in parents:
                        if len(self.graph.successors(parent)) == 1:
                            # commit_node is the last commit of the branch
                            branch_counter -= 1
                    branch_counter += 1  # one parent is from the "main" branch
                result.append((1,branch_counter))
        except IndexError:
            # visited all nodes
            return result

    def iterate_commits(self):
        unvisited_nodes = PriorityQueue()
        already_seen = set()
        for initial_commit in self.graph.successors_iter(self.sentinel):
            unvisited_nodes.push(initial_commit, self.graph.node[initial_commit]["commit_timestamp"])
            already_seen.add(initial_commit)
        try:
            while(True):
                # iterate over commits in order of commit_timestamps
                commit_node = unvisited_nodes.pop()
                children = self.graph.successors(commit_node)
                new_nodes = [child for child in children if child not in already_seen]
                for node in new_nodes:
                    unvisited_nodes.push(node, self.graph.node[node]["commit_timestamp"])
                already_seen |= set(new_nodes)
                yield commit_node
        except IndexError:
            raise StopIteration


if __name__ == "__main__":
    g = GitGraph()
    print(g.metric6())
