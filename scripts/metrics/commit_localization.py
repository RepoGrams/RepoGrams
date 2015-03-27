import os
import itertools
import jellyfish
import numpy
from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def commit_localization(graph):
        """Computes the relative number of directories modified by a commit."""
        result = []
        for commit in graph.iterate_commits():
            paths = map(os.path.dirname, graph.commit_files[commit])
            if len(paths) <= 1:
                result.append(len(paths))
                continue
            similarity_scores = []
            for pair_of_files in itertools.combinations(paths, 2):
                distance = jellyfish.jaro_winkler(*pair_of_files)
                similarity_scores.append(distance)
            result.append(numpy.mean(similarity_scores))
        return result