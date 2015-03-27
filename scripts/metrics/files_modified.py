import os
import itertools
import jellyfish
import numpy
from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def files_modified(graph):
        """Computes the number of files modified in a particular commit."""
        result = []
        for commit in graph.iterate_commits():
            files_modified_in_commit = len(graph.commit_files[commit])
            result.append(files_modified_in_commit)
        return result