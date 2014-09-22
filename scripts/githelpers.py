# -!- encoding: utf-8

import subprocess
from utils import debug


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
    filestats, parents, commit_timestamp, commitmsg, _ = out.decode(
        'utf8', 'ignore'
    ).split(separator)
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
    command = """git rev-list --all --remotes --reverse --topo-order"""
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    all_commits = out.decode('utf8', 'ignore').split("\n")[:-1]
    return all_commits


def get_branch_heads():
    """:returns: a tuple (master branch shasum, list of branch head shasums)"""
    command = """git ls-remote --heads"""
    pipe = subprocess.Popen(command.split(" "), stdout=subprocess.PIPE)
    out, err = pipe.communicate()
    all_heads_with_name = out.decode('utf8', 'ignore').split("\n")[:-1]
    all_heads = []
    master = None
    for head in all_heads_with_name:
        # split head into shasum and name, extract shasum afterwardts
        shasum = head.split()[0]
        all_heads.append(shasum)
        if master is None and head.endswith("master"):
            master = shasum
    debug(master)
    debug(all_heads)
    return master, all_heads
