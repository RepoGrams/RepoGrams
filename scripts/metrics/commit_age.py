import os
import itertools
import jellyfish
import numpy
from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def commit_age(graph):
        """Computes the age of the commit, based on the lowest time difference between the commit and any of its
        parents."""
        result = []
        for commit in graph.iterate_commits():
            commit = graph.vertex2commit[commit]
            parent_distances = [commit.commit_time - parent.commit_time for parent in commit.parents]
            result.append(min(parent_distances) if parent_distances else 0)
        return result