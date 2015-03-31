from metrics.base import metric


@metric
def author_experience(self):
    """Enumerates the commits of each author and displays the value during the current commit."""
    result = []
    author_num_commits = {}

    for commit in self.iterate_commits():
        author_email = self.vertex2commit[commit].author.email
        if author_email not in author_num_commits:
            author_num_commits[author_email] = 1
        else:
            author_num_commits[author_email] += 1

        result.append(author_num_commits[author_email])
    return result