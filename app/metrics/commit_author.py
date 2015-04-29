from metrics.base import metric


@metric
def commit_author(graph):
    """Computes a unique numeric ID for each commit author, based on email address and name."""
    result = []

    # Build a list of set-pairs that contain all matching author names and/or emails
    authors_meta_sets = []
    for commit in graph.iterate_commits():
        name_index, email_index = None, None
        author = graph.vertex2commit[commit].author

        # Look for the author's name and/or email in existing set-pairs
        for name_index in (item[0] for item in enumerate(authors_meta_sets) if author.name in item[1]['names']):
            break

        for email_index in (item[0] for item in enumerate(authors_meta_sets) if author.email in item[1]['emails']):
            break

        if name_index is None and email_index is None:
            # This is a new name and email - create a new set-pair
            authors_meta_sets.append({
                'names': {author.name},
                'emails': {author.email},
            })
        elif name_index is not None and email_index is None:
            # An existing name with a new email - add the email to the relevant set-pair
            authors_meta_sets[name_index]['emails'].add(author.email)
        elif name_index is None and email_index is not None:
            # An existing email with a new name - add the name to the relevant set-pair
            authors_meta_sets[email_index]['names'].add(author.name)
        elif name_index != email_index:
            # An existing email and an existing name that were found in different set-pairs - merge the two set-pairs
            high_index, low_index = max(name_index, email_index), min(name_index, email_index)
            merge_from = authors_meta_sets.pop(high_index)
            merge_to = authors_meta_sets[low_index]

            merge_to['names'] = merge_to['names'] | merge_from['names']
            merge_to['emails'] = merge_to['emails'] | merge_from['emails']

        # The only remaining option is that both the name and the email address were found, but are already in the same
        # pair, in which case nothing remains to be done.

    # Build a map from author name to color. Since name/email pairs have all been merged when identifying the same
    # person, we can index solely on the author name.
    for commit in graph.iterate_commits():
        author = graph.vertex2commit[commit].author
        name_index = [item[0] for item in enumerate(authors_meta_sets) if author.name in item[1]['names']][0]

        result.append({
            'name': author.name,
            'email': author.email,
            'id': name_index,
        })

    return result
