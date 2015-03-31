import collections

from metrics.base import metric


@metric
def most_edited_file(graph):
        """Computes number of edits to the most edited file."""
        result = []
        file_modified_counter = collections.Counter()
        for commit in graph.iterate_commits():
            metric_value = 0
            for f in graph.commit_files[commit]:
                file_modified_counter[f] += 1
                if file_modified_counter[f] > metric_value:
                    metric_value = file_modified_counter[f]
            result.append(max(0, metric_value - 1))
        return result