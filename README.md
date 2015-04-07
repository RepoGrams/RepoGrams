# RepoGrams #

RepoGrams is a web-tool that allows users to analyze and compare the history of multiple software projects. It computes
and visualizes a variety of metrics over time, such as the number of programming languages used in a project over time
or how often developers change code across different modules (directories).

RepoGrams supports researchers in the software engineering community by comparing and contrasting source code
repositories of multiple software projects and helps them in selecting appropriate evaluation targets for their studies.


## Deployment ##

RepoGrams runs inside a [docker](https://www.docker.com/) image. Once clones, run `./build.sh [domain-name]` (defaults
to `localhost`) in a shell to build the image locally. Use `./run.sh [port-number]` (defaults to `1234`) and `./stop.sh`
to run and stop the application respectively.

To add examples to your deployment, add a file called `examples.partial.js` to the root directory before building the
docker image. See file `data/examples.partial.js` for an example of an examples file.

You can cache a large number of git repositories on the server side by running `./precache.sh [domain-name]
[list-of-repository-urls-file]` where the latter is a simple text file with one git repository URL per line. This
command will load all the repositories into the running docker image's memory to be served quicker when called in the
web application.


## Development ##

Developing inside a docker image is inconvenient. A more convenient way to develop is to deploy RepoGrams locally on
your machine.

Start by installing the following libraries on your machine:

* python (2.7.x), python-dev, and python-pip
* [python-graph-tool](http://graph-tool.skewed.de/)
* [libgit2](https://libgit2.github.com/)
* [libblas-dev](http://www.netlib.org/blas/)
* [liblapack-dev](http://www.netlib.org/lapack/)
* [gfortran](http://gcc.gnu.org/fortran/)

(Please create an issue or pull request if we forgot to list a dependency)

Create and activate a [virtualenv](https://virtualenv.pypa.io/) based on Python 2.7.x. Once activated install the
requirements.txt inside the virtualenv using pip:
`pip install -r requirements.txt`

Copy the python-graph-tool library from the distribution-wide lib directory to the virtualenv. Unfortunately graph-tool
is not available on pip.
`cp -r /usr/lib/python2.7/dist-packages/graph_tool /path/to/venv/lib/python2.7/site-packages/`
(the paths on your system might vary)

Modify `serve.py` to change the line:
`INSTANCE_CONFIG = INSTANCE_CONFIG_DEFAULT`
to
`INSTANCE_CONFIG = INSTANCE_CONFIG_FOR_LOCAL_DEBUGGING`

Run the application with `python serve.py`. Point your browser to http://localhost:8090/.

If you make server-side changes you need to restart the server. If you make client-side (HTML, CSS, or JavaScript)
changes you do not need to restart the server.

### Adding metrics ###

To add a new metric you will have to:

* Create the computation / server-side (Python) file inside `metrics`. Start by copying `_examples.py` and modifying it.
* Create the presentation / client-side (JavaScript) file inside `metrics`. Start by copying `_examples.js` and
  modifying it.
* Modify the `metrics/__init__.py` file to register your module. Make sure you import the metric, not the module in
  which the metric resides.


## License ##

RepoGrams is released under the [GPL](https://www.gnu.org/copyleft/gpl.html).
