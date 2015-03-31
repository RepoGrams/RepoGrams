import os

from metrics.base import metric


@metric
def pom_files(graph):
        """Computes the number of pom.xml files that were modified in a commit."""

        result = []
        for commit in graph.iterate_commits():
            pom_files_changed = sum(1 for f in graph.commit_files[commit] if os.path.basename(f) == 'pom.xml')
            result.append(pom_files_changed)
        return result