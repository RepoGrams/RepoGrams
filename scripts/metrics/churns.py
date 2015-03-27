from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def churns(graph):
        result = []
        for commit in graph.iterate_commits():
            result.append(graph.commit_churn[commit])
        return result