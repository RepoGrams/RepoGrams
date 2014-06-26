#!/usr/bin/env python3

from __future__ import print_function

import subprocess
import itertools


"""Returns the ids of all children of a given commit
:commit_id: the commit for which you want to obtain the children"""
def list_children(commit_id):
    command = """git rev-list --all --not {0}^@ --children""".format(commit_id)
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    for line in pipe.stdout:
        line = line.decode().strip()
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
    parents, commitmsg = out.decode().split(separator)
    return parents.split(), commitmsg


def get_all_commits():
    command = """git rev-list --branches --reverse"""
    list_children("HEAD")
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    all_commits = out.decode().split("\n")[:-1]
    return all_commits


def metric6():
    already_seen = set()
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
            Therefore, we use git-merge-base --fork as suggested in
            http://stackoverflow.com/questions/1527234/finding-a-branch-point-with-git
            to find the oldest common ancestor (OCA) of each pair of the first child
            and the other children. Then, only if OCA equals the current commit
            we increment the branch counter
            """
            # TODO: merge-base does not work for this :-(
            command = "git merge-base --fork {} {}"
            for child_pair in itertools.product(children[0:1], children[1:]):
                print(child_pair)
                pipe = subprocess.Popen(command.format(*child_pair).split(" "), stdout=subprocess.PIPE)
                out, err = pipe.communicate()
                oca = out.decode().strip()
                if (commit == oca):
                    print("new branch")
                    branch_counter += 1
                else:
                    print(oca)
        if len(parents) > 1:
            branch_counter -= (len(parents)-1)
            print("merge commit") # TODO but maybe not the last commit
        #already_seen |= set(children)
        already_seen.add(commit)
        print(commitmsg, branch_counter, "======")


if __name__ == "__main__":
    metric6()
