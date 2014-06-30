#!/usr/bin/env python2
# -!- encoding: utf-8

from __future__ import print_function

import subprocess
import itertools
import collections

import networkx as nx

"""Returns the ids of all children of a given commit
:commit_id: the commit for which you want to obtain the children"""
def list_children(commit_id):
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
    separator = "\a"
    command = """git diff-tree --always -s --pretty=format:%P{1}%B' --root -r {0}""".format(commit_id, separator)
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    parents, commitmsg = out.decode('utf8', 'ignore').split(separator)
    return parents.split(), commitmsg


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
        self.graph.add_node(self.sentinel)
        for commit in get_all_commits():
            parents, commitmsg = get_commit_data(commit)
            self.graph.add_node(commit, commitmsg=commitmsg)
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

        dominators = collections.defaultdict(set) # { block : {dominators} }
        for node in self.graph.nodes_iter():
            dominators[node] = set(self.graph.nodes())

        dominators[self.sentinel] = set(self.sentinel)
        # TODO

        return dominators



def metric6():
    branch_counter = 0
    for commit in get_all_commits():
        parents, commitmsg = get_commit_data(commit)
        children = list_children(commit)
        if len(parents) == 0:  # first commit of branch
            branch_counter += 1
            print("initial commit")
        elif (len(children) > 1):  # commit starts one or more new branches
            """
            Consider
            A---B---D--F---...
            \         /
             \--C---E---G---...
            here E will have two children, F and G
            However, it doesn't create a new branch, because it was already
            created by A
            To fix this, we increase the counter iff the commit dominates it children
            """
            # TODO: merge-base does not work for this :-(
            command = "git merge-base --fork {} {}"
            for child_pair in itertools.product(children[0:1], children[1:]):
                print(child_pair)
                pipe = subprocess.Popen(command.format(*child_pair).split(" "), stdout=subprocess.PIPE)
                out, err = pipe.communicate()
                oca = out.decode('utf8', 'ignore').strip()
                if (commit == oca):
                    print("new branch")
                    branch_counter += 1
                else:
                    print(oca)
        if len(parents) > 1:
            branch_counter -= (len(parents)-1)
            print("merge commit") # TODO but maybe not the last commit
        print(commitmsg, branch_counter, "======")


if __name__ == "__main__":
    g = GitGraph()
    g.plot()
