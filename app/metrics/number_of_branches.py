from graph_tool import graph_tool

from metrics.base import metric
from app.utils import Order


@metric
def number_of_branches(graph):
    commit_to_number_of_branches = _number_of_branches(graph)

    result = []
    for commit in graph.iterate_commits():
        result.append(commit_to_number_of_branches[commit])
    return result


def _number_of_branches(graph):
    commit_to_number_of_branches = {}
    branch_counter = 0
    for commit_node in graph.iterate_commits(Order.TOPO):
        # iterate over commits in order of commit_timestamps
        parents = list(commit_node.in_neighbours())
        children = list(commit_node.out_neighbours())

        if parents[0] == graph.sentinel:  # first commit of branch
            assert (len(parents) == 1), "First commit of branch has no predecessor"
            branch_counter += 1

        branch_counter -= _ended_branches_count(graph, commit_node, parents)

        assert branch_counter > 0, "There should be at least one branch all the time: branch_counter: {}, commit {}: ". \
            format(branch_counter, graph.commit_hashsum[commit_node])

        commit_to_number_of_branches[commit_node] = branch_counter

        # add the newly created branches AFTERWARDS the branches diverge at this commit, but the number of branches is
        # only increased in the children.
        branch_counter += _created_branches_count(graph, commit_node, children)
        assert branch_counter > 0, "There should be at least one branch all the time: branch_counter: {}, commit {}: ". \
            format(branch_counter, graph.commit_hashsum[commit_node])
    return commit_to_number_of_branches


def _ended_branches_count(graph, commit_node, parents):
    if not len(parents) > 1:
        return 0

    """
    Consider
    A------C--D--F (master)
      \    /
        \--B-----E  (feature branch)
    In this case, C has multiple parents
    However, it is NOT the end of a branch, as the feature branch is still continued (by commit E)
    To respect this, we only subtract one from the counter for each parent with only one child
    """
    ended_counter = 0

    for parent in parents:
        # TODO: not in parents is not sufficient
        # we need to check if is there is a path from child to parents - parent
        destinies = set(parents)
        destinies.remove(parent)
        parent_counter = 0
        for child in parent.out_neighbours():
            if child == commit_node:
                continue
            parent_counter += sum(1 for destiny in destinies if
                                  (child == destiny or graph_tool.topology.shortest_path(graph.graph, child, destiny)[
                                      0]))
        child_count = sum(1 for _ in parent.out_neighbours())
        if child_count - parent_counter == 1:
            # commit_node is the last commit of the branch
            ended_counter += 1
    ended_counter -= 1  # one parent is from the "main" branch

    # A merge commit might not end any branch, e.g. commit 9b0235dd7ca88fa1f5a83552b457bf95b6de6f73 of the bootstrap
    # repository.
    # Therefore we set the counter to 0 if it's negative.
    return max(ended_counter, 0)


def _created_branches_count(graph, commit_node, children):
    """
        Returns the number of new branches a commit creates
        Consider
        A---B---D--F---...
        \        /
         \--C---E---G---...
        here E will have two children, F and G
        However, it doesn't create a new branch, because it was already
        created by A
        To fix this, we increase the counter
        ifF the commit dominates it children
        """
    if not len(children) > 1:
        return 0

    branch_counter = 0
    assoc_branch = graph.associated_branch[commit_node]

    # By excluding the child from the same branch, we avoid the issue that it not necessarily dominated.
    # An example for this is efea0f23f9e0f147c5ff5b5d35249417c32c3a53 from jQuery
    for child in children:
        if commit_node == graph.graph.vertex(graph.dominator_tree[child]) and graph.associated_branch[
            child] != assoc_branch:  # exclude child from same branch
            branch_counter += 1

    # There are actually commits with multiple children which dominate none of them, in this case branch_counter becomes
    # negative because of the last line, adjusting for the "main" branch; therefore we have to reset branch_counter to
    # zero.
    # An example of such a commit is 738036395d68824933949186603aeeb9c087d10e of the repograms repository
    return max(branch_counter, 0)