from functools import wraps

__author__ = 'daniel'


def metric(colors, bucket_type):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            return f(*args, **kwargs)

        wrapper.id = f.func_name
        wrapper.colors = colors
        wrapper.bucket_type = bucket_type

        return wrapper
    return decorator