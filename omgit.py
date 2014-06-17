#!/usr/bin/env python

import subprocess

"""
Returns the ids of all children of a given commit
:commit_id: the commit for which you want to obtain the children
"""
def list_children(commit_id):
    command = """git rev-list --all --not {0}^@ --children""".format(commit_id)
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    for line in out:
        if line.startswith(commit_id):
            return line.split(" ")[1:]
    return []

def get_commit_data(commit_id):
    separator = "\a"
    command = """git diff-tree --always -s --pretty=format:%P{1}%B' --root -r {0}""".format(commit_id, separator)
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    parents, commitmsg = out.split(separator)
    return parents, commitmsg


# Test
#list_children 6f8d17c604045e312ff5b0d373946b4fcaea5c55
# iterate over commits
  # --always: handle empty commits
  # -s: don't show p, we do it later
  # --root: else the first commit won't work
  # -r: the commit we want to display
  # --pretty: format string which prints all we need
command = """git rev-list --branches --topo-order --reverse"""
list_children("HEAD")
pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
out, err = pipe.communicate()
all_commits = out.split("\n")[:-1]
for commit in all_commits:
    print get_commit_data(commit)
#for commit in $(git rev-list --branches --topo-order --reverse)
#do
  #git diff-tree --always -s --pretty=format:'id:%H%nparents:%P%n' --root -r $commit
  #msg "Children:"
  #list_children $commit;
#done


# Wenn commmit mehrere Children hat, finde oldest common ancestor
