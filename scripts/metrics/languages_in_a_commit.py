import json
import os
import itertools
import collections
from scripts.metrics.base import metric


@metric(None, None)  # TODO colors and bucket type
def languages_in_a_commit(graph):
        """Computes the number of different file languages of the commits."""
        with open("data/languages.json") as f:
            languages = json.load(f)
            name_mapping = dict(itertools.izip(languages["NAMES"], languages["TYPES"]))
            extension_mapping = dict(itertools.izip(languages["ENDINGS"], languages["TYPE"]))

        result = []
        for commit in graph.iterate_commits():
            file_type_counter = collections.Counter()
            for f in graph.commit_files[commit]:
                filename = f
                try:
                    file_type = name_mapping[filename]
                except KeyError:
                    try:
                        # [1] is the extension with dot, [1:] removes the dot
                        file_extension = os.path.splitext(f)[1][1:]
                        file_type = extension_mapping[file_extension]
                    except KeyError:
                        file_type = "Other"
                file_type_counter[file_type] += 1
            result.append(len(file_type_counter))
        return result