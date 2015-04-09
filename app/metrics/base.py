from functools import wraps


def metric(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs)

    wrapper.id = f.func_name

    return wrapper
