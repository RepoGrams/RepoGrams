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

    def __init__(self, repo_url, whitelist=None, repo_dir=None):
        """
        :repo_url: URL of the repository
        :repo_dir: directory where the repository is expected to reside
        """
        if whitelist and repo_url not in whitelist:
            raise GitException("Access Error: The repository which you have tried to access is not whitelisted.")
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

    def get_branch_heads(self):
        """:returns: a tuple ('master' branch, list of branch heads)"""
        remote_branch_names = self.repo.listall_branches(pygit2.GIT_BRANCH_REMOTE)
        remote_branches = map(lambda bname: self.repo.lookup_branch(bname,
                                                                    pygit2.GIT_BRANCH_REMOTE),
                              remote_branch_names)
        head_commits = map(lambda x: x.get_object().oid, remote_branches)
        for (index, branch) in enumerate(remote_branch_names):
            if branch.endswith("master"):
                master = head_commits[index]
                break
        else: # no branch named with master
            master = head_commits[0]
        return (master, head_commits)



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
            diff = diffs[0]
            for d in diffs[1:]:
                diff.merge(d)
            assert diff is not None, parents
        else:
            diff = commit.tree.diff_to_tree(flags=pygit2.GIT_DIFF_REVERSE)
            assert diff is not None, parents
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
