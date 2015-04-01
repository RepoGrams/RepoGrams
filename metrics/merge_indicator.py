from metrics.base import metric


@metric
def merge_indicator(graph):
        """Determines if a commit involved a merge, by enumerating on the parents involved in that commit."""
        result = []
        for commit in graph.iterate_commits():
            result.append(sum(1 for parent in commit.in_neighbours() if parent != graph.sentinel))
        return result