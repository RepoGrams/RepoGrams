from metrics.base import metric


@metric
def commit_author(graph):
    """Computes a unique numeric ID for each commit author, based on email address."""
    result = []
    authors = []

    for commit in graph.iterate_commits():
        author_email = graph.vertex2commit[commit].author.email
        if author_email not in authors:
            authors.append(author_email)
        result.append(authors.index(author_email))

    return result