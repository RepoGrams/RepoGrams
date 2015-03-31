from metrics.base import metric


@metric
def merge_indicator(graph):
        """Determines if a commit involved a merge, by enumerating on the parents involved in that commit."""
        result = []
        for commit in graph.iterate_commits():
            result.append(graph.commit_num_parents[commit])  # TODO do we really need commit_num_parents in the graph?
        return result