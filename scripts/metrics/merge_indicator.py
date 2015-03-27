import os
import itertools
import jellyfish
import numpy
from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def merge_indicator(graph):
        """Determines if a commit involved a merge, by enumerating on the parents involved in that commit."""
        result = []
        for commit in graph.iterate_commits():
            result.append(graph.commit_num_parents[commit])  # TODO do we really need commit_num_parents in the graph?
        return result