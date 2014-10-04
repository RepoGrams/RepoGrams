# -!- encoding: utf-8

import os
import subprocess
import tempfile
from utils import debug

import pygit2


class GitException(Exception):
    def __init__(self, message):
        self.message = message


class GitHelper(object):

    def __init__(self, repo_url, repo_dir=None):
        """
        :repo_url: URL of the repository
        :repo_dir: directory where the repository is expected to reside
        """
        if repo_dir is not None:
            try:
                os.chdir(repo_dir)
                update_repo()
            except OSError:
                pass
        dirpath = tempfile.mkdtemp()
        os.chdir(dirpath)
        try:
            self.repo = pygit2.clone_repository(repo_url, dirpath)
        except pygit2.GitError as e:
            raise GitException("Cloning failed. {}".format(e.message))

    def get_all_commits(self):
        remote_branch_names = self.repo.listall_branches(pygit2.GIT_BRANCH_REMOTE)
        remote_branches = map(lambda bname: self.repo.lookup_branch(bname,
                                                                    pygit2.GIT_BRANCH_REMOTE),
                              remote_branch_names)
        head_commits = map(lambda x: x.get_object().oid, remote_branches)
        walker = self.repo.walk(head_commits[0],
                                pygit2.GIT_SORT_REVERSE |
                                pygit2.GIT_SORT_TOPOLOGICAL)
        for other_head in head_commits[1:]:
            walker.push(other_head)
        commits = []
        for commit in walker:
            commits.append(str(commit.oid))  # later: don't use str
        return commits

def check_output(*args, **kwargs):
    subprocess.check_output(*args, stderr=subprocess.STDOUT, **kwargs)

def update_repo():
    """
    Returns true if repository has changed since last clone/pull
    If so, updates the repo
    """
    command = "git fetch --all"
    try:
        subprocess.check_call(command.split())
        command = "git rev-list HEAD...origin/master --count"
        if int(subprocess.check_call(command.split())) == 0:
            return False

        command = "git reset --hard FETCH_HEAD"
        check_output(command.split())
    except subprocess.CalledProcessError as e:
        raise GitException("Internal git error. git returned {}".format(e.output))
    return True


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
