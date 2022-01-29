import os
import itertools

import jellyfish

from metrics.base import metric


@metric
def commit_localization(graph):
    """Computes the relative number of directories modified by a commit."""
    result = []
    for commit in graph.iterate_commits():
        paths = [os.path.dirname(file) for file in graph.commit_files[commit]]
        if len(paths) <= 1:
            result.append(len(paths))
            continue
        similarity_scores = []
        for pair_of_files in itertools.combinations(paths, 2):
            distance = jellyfish.jaro_winkler(*pair_of_files)
            similarity_scores.append(distance)
        result.append(float(sum(similarity_scores)) / max(len(similarity_scores), 1))
    return result