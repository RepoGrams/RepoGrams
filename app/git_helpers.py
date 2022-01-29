import os
import tempfile

import pygit2


class DirManager(object):
    def __init__(self, basedir=None):
        if basedir is None:
            basedir = tempfile.mkdtemp()
        self.basedir = basedir
        self.url2dir = {}

    def get_repo_dir(self, url):
        if url in self.url2dir:
            return self.url2dir[url]
        dir_path = tempfile.mkdtemp(dir=self.basedir)
        self.url2dir[url] = dir_path
        return dir_path


class GitException(Exception):
    def __init__(self, message):
        self.message = message


class GitHelper(object):
    def __init__(self, repo_url, dir_manager):
        """
        :repo_url: URL of the repository
        :repo_dir: directory where the repository is expected to reside
        """
        self.up2date = False
        self.repo_url = repo_url
        dir_path = dir_manager.get_repo_dir(repo_url)

        if not os.path.isfile(dir_path + '/HEAD'):
            try:
                self.repo = pygit2.clone_repository(repo_url, dir_path, bare=True)
            except pygit2.GitError as e:
                raise GitException("Cloning failed. {}".format(e.message))
        else:
            self.repo = pygit2.Repository(pygit2.discover_repository(dir_path))
            self.up2date = True

    def get_branch_heads(self):
        """:returns: a tuple ('master' branch, list of branch heads)"""
        remote_branch_names = self.repo.listall_branches(pygit2.GIT_BRANCH_REMOTE)
        remote_branches = [self.repo.lookup_branch(branch_name, pygit2.GIT_BRANCH_REMOTE) for branch_name in remote_branch_names]
        head_commits = [remote_branch.peel().oid for remote_branch in remote_branches]
        for (index, branch) in enumerate(remote_branch_names):
            if branch.endswith("master"):
                master = head_commits[index]
                break
        else:  # no branch named with master
            master = head_commits[0]
        return master, head_commits

    def get_all_commits(self):
        remote_branch_names = self.repo.listall_branches(pygit2.GIT_BRANCH_REMOTE)
        remote_branches = [self.repo.lookup_branch(branch_name, pygit2.GIT_BRANCH_REMOTE) for branch_name in remote_branch_names]
        head_commits = [remote_branch.peel().oid for remote_branch in remote_branches]
        walker = self.repo.walk(head_commits[0], pygit2.GIT_SORT_REVERSE | pygit2.GIT_SORT_TOPOLOGICAL)
        for other_head in head_commits[1:]:
            walker.push(other_head)
        for commit in walker:
            yield commit


def get_patch_data(commit):
    parents = commit.parents
    if parents:
        diff = commit.tree.diff_to_tree(parents[0].tree, flags=pygit2.GIT_DIFF_REVERSE)
        diff.find_similar()
    else:
        diff = commit.tree.diff_to_tree(flags=pygit2.GIT_DIFF_REVERSE)

    churn = diff.stats.insertions + diff.stats.deletions
    files = set(patch.delta.new_file.path for patch in diff)
    return churn, files
