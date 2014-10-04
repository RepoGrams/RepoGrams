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
        for commit in walker:
            yield commit  # later: don't use str

    def get_commit_data(self, commit):
        # iterate over commits
        # --always: handle empty commits
        # -s: don't show p, we do it later
        # --root: else the first commit won't work
        # -r: the commit we want to display
        # --pretty: format string which prints all we need
        #   %P: parents   |   %ct: commiter time stamp     | %B commitmsg
        parents = commit.parents
        diffs = []
        for parent in parents:
            diffs.append(self.repo.diff(commit, parent, flags=pygit2.GIT_DIFF_REVERSE))
        if diffs:
            diff = reduce(lambda d1,d2: d1.merge(d2), diffs)
        else:
            diff = commit.tree.diff_to_tree(flags=pygit2.GIT_DIFF_REVERSE)
        patches = [patch for patch in diff]
        # could  be done with reduce...
        added = sum(patch.additions for patch in patches)
        removed = sum(patch.deletions for patch in patches)
        files = set()
        for patch in patches:
            files.add(patch.new_file_path)
        message = commit.message
        timestamp = commit.commit_time
        return (parents, timestamp, message, added, removed, files)


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
