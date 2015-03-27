from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def files(graph):
        result = []
        for commit in graph.iterate_commits():
            result.append(list(graph.commit_files[commit]))
        return result