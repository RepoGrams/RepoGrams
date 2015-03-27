from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def branches_used(graph):
    """Take the associated branch."""
    result = []
    for commit in graph.iterate_commits():
        result.append(graph.associated_branch[commit])
    return result