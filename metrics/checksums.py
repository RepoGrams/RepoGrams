from metrics.base import metric


@metric
def checksums(graph):
    result = []
    for commit in graph.iterate_commits():
        result.append(graph.commit_hashsum[commit])
    return result