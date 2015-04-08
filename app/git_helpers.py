import os
import tempfile
from urlparse import urlparse

import pygit2
from pygit2 import credentials


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


class CredentialsManager(object):
    def __init__(self, credentials_file):
        self._credentials = {}

        if os.path.isfile(credentials_file):
            with open(credentials_file) as f:
                for line in f.readlines():
                    line = line.strip()
                    if line and line[0] != '#':
                        line = line.split(':', 2)
                        self._credentials[line[0]] = credentials.UserPass(*line[1:])

    def get_credentials(self, repo_url):
        parsed_url = urlparse(repo_url)
        if parsed_url.scheme == 'https' and parsed_url.netloc in self._credentials:
            return self._credentials[parsed_url.netloc]
        return None


class GitException(Exception):
    def __init__(self, message):
        self.message = message


class GitHelper(object):
    def __init__(self, repo_url, dir_manager, credentials_manager):
        """
        :repo_url: URL of the repository
        :repo_dir: directory where the repository is expected to reside
        """
        self.up2date = False
        self.repo_url = repo_url
        dir_path = dir_manager.get_repo_dir(repo_url)

        my_credentials = credentials_manager.get_credentials(repo_url)

        if not os.path.isfile(dir_path + '/HEAD'):
            try:
                self.repo = pygit2.clone_repository(repo_url, dir_path, bare=True, credentials=my_credentials)
            except pygit2.GitError as e:
                raise GitException("Cloning failed. {}".format(e.message))
        else:
            self.repo = pygit2.Repository(pygit2.discover_repository(dir_path))
            self.up2date = True

            def _remote_credentials(url, username_from_url, allowed_types):
                return credentials_manager.get_credentials(url)

            for remote in self.repo.remotes:
                remote.credentials = _remote_credentials
                transfer_progress = remote.fetch()
                if (hasattr(transfer_progress, 'received_objects') and transfer_progress.received_objects) or \
                        transfer_progress['received_objects']:
                    self.up2date = False

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
        else:  # no branch named with master
            master = head_commits[0]
        return master, head_commits

    def get_all_commits(self):
        remote_branch_names = self.repo.listall_branches(pygit2.GIT_BRANCH_REMOTE)
        remote_branches = map(lambda branch_name: self.repo.lookup_branch(branch_name, pygit2.GIT_BRANCH_REMOTE),
                              remote_branch_names)
        head_commits = map(lambda x: x.get_object().oid, remote_branches)
        walker = self.repo.walk(head_commits[0], pygit2.GIT_SORT_REVERSE | pygit2.GIT_SORT_TOPOLOGICAL)
        for other_head in head_commits[1:]:
            walker.push(other_head)
        for commit in walker:
            yield commit  # later: don't use str


def get_commit_data(commit):
    # iterate over commits
    # --always: handle empty commits
    # -s: don't show p, we do it later
    # --root: else the first commit won't work
    # -r: the commit we want to display
    # --pretty: format string which prints all we need
    # %P: parents   |   %ct: committer time stamp     | %B commit_message
    parents = commit.parents
    diffs = []
    for parent in parents:
        diffs.append(commit.tree.diff_to_tree(parent.tree, flags=pygit2.GIT_DIFF_REVERSE))
    if diffs:
        diff = diffs[0]
        for d in diffs[1:]:
            diff.merge(d)
        assert diff is not None, parents
    else:
        diff = commit.tree.diff_to_tree(flags=pygit2.GIT_DIFF_REVERSE)
        assert diff is not None, parents
    patches = [patch for patch in diff]
    # could be done with reduce...
    added = sum(patch.additions for patch in patches)
    removed = sum(patch.deletions for patch in patches)
    files = set()
    for patch in patches:
        files.add(patch.new_file_path)
    message = commit.message
    timestamp = commit.commit_time
    return parents, timestamp, message, added, removed, files
