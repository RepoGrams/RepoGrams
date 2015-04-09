from metrics.base import metric


@metric
def commit_message_length(graph):
    result = []
    for commit in graph.iterate_commits():
        message = graph.commit_message[commit]
        result.append(len(message.strip().split()))
    return result