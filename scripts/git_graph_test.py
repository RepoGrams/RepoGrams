#!/usr/bin/env python2
import sys

import git_graph as git_graph
import githelpers as gh


if __name__ == "__main__":
    dirmanager = gh.DirManager()
    cache = git_graph.GitGraphCache()

    repourl = sys.argv[1]
    print "Trying to clone {}".format(repourl)
    try:
        git_helper = gh.GitHelper(repourl, dirmanager)
    except gh.GitException as e:
        print e.message
    g = git_graph.GitGraph(git_helper, cache)
    print g.export()

