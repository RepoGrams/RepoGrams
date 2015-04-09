from metrics.base import metric


@metric
def _example(graph):
    result = []

    for commit in graph.iterate_commits():
        # TODO calculate something with this commit
        result.append(0)

    return result