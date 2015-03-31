from metrics.base import metric


@metric
def branches_used(graph):
    """Take the associated branch."""
    result = []
    for commit in graph.iterate_commits():
        result.append(graph.associated_branch[commit])
    return result