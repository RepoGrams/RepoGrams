from metrics.base import metric


@metric
def files(graph):
        result = []
        for commit in graph.iterate_commits():
            result.append(list(graph.commit_files[commit]))
        return result