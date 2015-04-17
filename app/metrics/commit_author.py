from metrics.base import metric


@metric
def commit_author(graph):
    """Computes a unique numeric ID for each commit author, based on email address."""
    result = []

    for commit in graph.iterate_commits():
        author = graph.vertex2commit[commit].author
        result.append({'name': author.name, 'email': author.email})

    return result