# -!- encoding: utf-8
from __future__ import print_function

import sys
import heapq
from functools import wraps


def debug_on(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        global debug
        old = debug

        def debug(*args, **kwargs):
            print(*args, file=sys.stderr, **kwargs)

        result = func(*args, **kwargs)
        debug = old
        return result

    return wrapper


def debug(*args, **kwargs):
    pass


class Order:
    TOPO = 1
    CHRONO = 2


class PriorityQueue:
    """A priority queue. Returs elements with lower priority first"""

    def __init__(self):
        self._queue = []
        self._index = 0

    def push(self, item, priority):
        heapq.heappush(self._queue, (priority, self._index, item))
        self._index += 1

    def pop(self):
        return heapq.heappop(self._queue)[-1]
