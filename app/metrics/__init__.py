from metrics.author_experience import author_experience
from metrics.checksums import checksums
from metrics.churns import churns
from metrics.commit_age import commit_age
from metrics.branches_used import branches_used
from metrics.commit_author import commit_author
from metrics.commit_localization import commit_localization
from metrics.commit_message_length import commit_message_length
from metrics.commit_messages import commit_messages
from metrics.files import files
from metrics.files_modified import files_modified
from metrics.languages_in_a_commit import languages_in_a_commit
from metrics.merge_indicator import merge_indicator
from metrics.most_edited_file import most_edited_file
from metrics.number_of_branches import number_of_branches
from metrics.pom_files import pom_files

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