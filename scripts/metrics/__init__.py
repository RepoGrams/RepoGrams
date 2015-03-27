from scripts.metrics.author_experience import author_experience
from scripts.metrics.checksums import checksums
from scripts.metrics.churns import churns
from scripts.metrics.commit_age import commit_age
from scripts.metrics.branches_used import branches_used
from scripts.metrics.commit_author import commit_author
from scripts.metrics.commit_localization import commit_localization
from scripts.metrics.commit_message_length import commit_message_length
from scripts.metrics.commit_messages import commit_messages
from scripts.metrics.files import files
from scripts.metrics.files_modified import files_modified
from scripts.metrics.languages_in_a_commit import languages_in_a_commit
from scripts.metrics.merge_indicator import merge_indicator
from scripts.metrics.most_edited_file import most_edited_file
from scripts.metrics.number_of_branches import number_of_branches
from scripts.metrics.pom_files import pom_files

active_metrics = [
    checksums,
    churns,
    commit_messages,
    files,
    commit_localization,
    commit_message_length,
    languages_in_a_commit,
    branches_used,
    most_edited_file,
    number_of_branches,
    pom_files,
    commit_author,
    commit_age,
    files_modified,
    merge_indicator,
    author_experience,
]