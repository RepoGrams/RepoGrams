FROM ubuntu:14.04
MAINTAINER RepoGrams Team <github.com/RepoGrams/RepoGrams>

# Add the apt repository for python-graph-tool
RUN echo 'deb http://downloads.skewed.de/apt/trusty trusty universe' >> /etc/apt/sources.list && echo 'deb-src http://downloads.skewed.de/apt/trusty trusty universe' >> /etc/apt/sources.list
COPY conf/pubkey pubkey
RUN apt-key add pubkey && rm pubkey

# Add the apt repository for libgit2 and python-pygit2
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y software-properties-common
RUN DEBIAN_FRONTEND=noninteractive add-apt-repository ppa:dennis/python

# Update apt and install dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y python python-graph-tool python-pip supervisor libgit2 python-pygit2 python-scipy nginx

# Install the required Python libraries using pip, minus the libraries that were already installed using apt-get
COPY requirements.txt requirements.txt
RUN sed -e '/numpy/d' -e '/pygit2/d' -e '/scipy/d' -i requirements.txt && pip install -r requirements.txt

# Copy the html files to be served
RUN mkdir -p /var/www/html
COPY ./ /var/www/html/

# Configure nginx
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/repograms.conf
RUN nginx -t
RUN mkdir -p /var/log/supervisor
COPY conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Fill in placeholders in the served files
RUN sed -i "s/@@@BUILDINFO@@@/`cat /var/www/html/.buildinfo`/g" /var/www/html/index.html
RUN sed -i "s/@@@BUILDDATE@@@/`cat /var/www/html/.builddate`/g" /var/www/html/fse2015/index.html
RUN if [ -f /var/www/html/examples.json ]; then sed -i -e '/@@@EXAMPLES_PLACEHOLDER@@@/{r /var/www/html/examples.json' -e 'd}' /var/www/html/js/controllers.js; fi
