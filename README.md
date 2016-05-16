# RepoGrams #

**RepoGrams will help you understand a project's history.** It uses a simple visual metaphor to represent a project's history across multiple metrics of interest. It supports metrics like:
 * who made commits, how often, and how much code did their commits change
 * the number of programming languages used in a project over time
 * how often developers changed code across different modules (directories)
 * the use of branches in the repository
 * and many others!

RepoGrams can help:
 * **managers** to analyze a team's performance and pin-point workflow issues
 * **developers** to understand the workflow and the history of an unfamiliar software project
 * **researchers** in the software engineering community to juxtapose software repositories of multiple projects to select an appropriate set of evaluation targets for a study

**Try our online deployment: http://repograms.net/**

## Deploying ##

RepoGrams runs inside a [docker](https://www.docker.com/) image. After cloning the repository, run `./build.sh`) in a
shell to locally build the image. Use `./run.sh [port-number]` (defaults to `1234`) and `./stop.sh` to start/stop the
application.

### Build options ###

The following are optional additions to RepoGrams. 

#### Example sets ####

You can add example states (pre-configured sets of repositories and corresponding metrics) to your deployment. Add a
file called `example-states.js` to the `build/` directory *before* building the docker image.

See the file `examples/example-states.js` for an example of an examples set file.

#### Credentials ####

RepoGrams only supports cloning HTTP and HTTPS repositories, however many websites, such as GitHub, support basic HTTPS
authentication. You can add support for specific websites by adding a `credentials` file to the `build/` directory
*before* building the docker image. The content of the file should be one credential per line, where each line takes the
form:

`example.com:janedoe:passwd`

GitHub supports app-specific tokens that can be used in lieu of the password.

#### Extra footer ####

You can add extra HTML to the footer of the page by adding it to `build/extra-footer.html`. This can enable adding
scripts such as web analytics.

#### Pre-cache repositories ####

You can cache a large number of git repositories on the server side by running `./precache.sh [domain-name]
[file-with-list-of-repository-urls]` where the latter is a text file with one git repository URL per line. This command
will load all the repositories into the running docker image's memory. As long as these repositories do not change, they
will be served from cache when called in the web application.


## Development ##

Developing inside a docker image is inconvenient. A more convenient way to develop is to deploy RepoGrams locally on
your machine.

Start by installing the following packages on your machine. We list the minimum version that works on our development
environments. Older versions might still work. If they worked for you please let us know so we can update this list.

* python (2.7.x), python-dev, and python-pip
* [python-graph-tool](http://graph-tool.skewed.de/) >= 2.2.42
* [libgit2-dev](https://libgit2.github.com/) >= 0.22.1
* [libblas-dev](http://www.netlib.org/blas/) >= 1.2.20110419
* [liblapack-dev](http://www.netlib.org/lapack/) >= 3.5.0
* [libffi-dev](http://sourceware.org/libffi/) >= 3.1
* [gfortran](http://gcc.gnu.org/fortran/) >= 4.9.1

In various Linux distributions you may be able to install most (if not all) of these packages using the distro package
manager, e.g., `sudo apt-get install <package-name>` in Debian/Ubuntu. However, if you do so pay careful attention to
the versions of the libraries installed, as your Linux distribution's package manager might only contain older
versions, in which case you will have to manually install a newer version. Please create an issue or pull request if
you believe we forgot to list a dependency.

Create and activate a [virtualenv](https://virtualenv.pypa.io/) based on Python 2.7.x. Once activated install the
requirements.txt inside the virtualenv using pip:
`pip install -r conf/requirements.txt`

Some users reported difficulty installing using the above command line, but managed to install the packages by running
`pip install <line-from-requirements.txt>`, where `<line-from-requirements.txt>` is each line of requirements.txt one
by one.

Copy the python-graph-tool library from the distribution-wide lib directory to the virtualenv. Unfortunately graph-tool
is not available on pip.
`cp -r /usr/lib/python2.7/dist-packages/graph_tool /path/to/venv/lib/python2.7/site-packages/`
(the paths on your system might vary)

Run the application with `python app/serve.py development` (the environment variable PYTHONPATH should be set to the
current directory. e.g., `PYTHONPATH=. python app/serve.py development`.) Point your browser to http://localhost:8090/.

### Adding metrics ###

To add a new metric you will have to:

* Create the computation / server-side (Python) file inside `app/metrics/`. Start by copying `_examples.py` and
  modifying it.
* Create the presentation / client-side (JavaScript) file inside `app/metrics/`. Start by copying `_examples.js` and
  modifying it.
* Modify the `app/metrics/__init__.py` file to register your module. Make sure that you import the metric, not the
  module containing the metric.

## Contact, research paper, citing ##

If you would like to get in touch, please contact [Ivan Beschastnikh](http://www.cs.ubc.ca/~bestchai/) at bestchai@cs.ubc.ca

We published a [research paper](http://www.cs.ubc.ca/~bestchai/papers/repograms-msr16.pdf) describing the design and evaluation of RepoGrams. If you are using RepoGrams for research and want a citation that you can use in the paper, here is the bibtex:
```
@inproceedings{Rozenberg2016,
   author = {Daniel Rozenberg and Ivan Beschastnikh and Fabian Kosmale and Valerie Poser and Heiko Becker and Marc Palyart and Gail Murphy},
   title = {{Comparing Repositories Visually with RepoGrams}},
   booktitle = {MSR 2016, Proceedings of the 2016 International Conference on Mining Software Repositories},
   address = {Austin, TX, USA},
   month = {May~14--15,},
   year = {2016}
}
```

## License ##

RepoGrams is released under the [GPL](https://www.gnu.org/copyleft/gpl.html).
