import heapq


class Order(object):
    TOPO = 1
    CHRONO = 2


class PriorityQueue:
    """A priority queue. Returns elements with lower priority first"""

    def __init__(self):
        self._queue = []
        self._index = 0

    def push(self, item, priority):
        heapq.heappush(self._queue, (priority, self._index, item))
        self._index += 1

    def pop(self):
        return heapq.heappop(self._queue)[-1]
