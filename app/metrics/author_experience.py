from metrics.base import metric
from metrics.commit_author import commit_author


@metric
def author_experience(graph):
    """Enumerates the commits of each author and displays the value during the current commit."""
    result = []
    author_ids = [author['id'] for author in commit_author(graph)]
    previous_commits_by_author = [1] * (max(author_ids) + 1)

    for author_id in author_ids:
        result.append(previous_commits_by_author[author_id])
        previous_commits_by_author[author_id] += 1
    return result
