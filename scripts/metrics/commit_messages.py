from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def commit_messages(graph):
        result = []
        for commit in graph.iterate_commits():
            result.append(graph.commit_message[commit])
        return result