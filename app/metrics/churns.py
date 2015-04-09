from metrics.base import metric


@metric
def churns(graph):
    result = []
    for commit in graph.iterate_commits():
        result.append(graph.commit_churn[commit])
    return result