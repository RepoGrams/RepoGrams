FROM ubuntu:14.04
MAINTAINER RepoGrams Team <github.com/RepoGrams/RepoGrams>

# Add the apt repository for python-graph-tool
COPY conf/pubkey /root/pubkey
RUN echo 'deb http://downloads.skewed.de/apt/trusty trusty universe' >> /etc/apt/sources.list \
  && apt-key add /root/pubkey \
  && rm /root/pubkey


# Add the apt repository for libgit2 and python-pygit2
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y software-properties-common \
  && DEBIAN_FRONTEND=noninteractive add-apt-repository ppa:launchpad/ppa

# Update apt and install dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    python \
    python-graph-tool \
    python-pip \
    supervisor \
    libgit2-22 \
    python-scipy \
    nginx \
    libgit2-dev \
    libffi-dev

# Install the required Python libraries using pip, minus the libraries that were already installed using apt-get
COPY conf/requirements.txt /root/requirements.txt
RUN sed -e '/numpy/d' -e '/scipy/d' -i /root/requirements.txt \
  && pip install -r /root/requirements.txt \
  && rm /root/requirements.txt \
  && DEBIAN_FRONTEND=noninteractive apt-get purge -y python-pip \
    libgit2-dev \
    libffi-dev

# Copy the server and client directories to be served
RUN mkdir -p /var/www/build /var/log/app
COPY app /var/www/app
COPY public /var/www/public

# Configure nginx and supervisor
COPY conf/repograms.conf /etc/nginx/sites-available/repograms
RUN rm /etc/nginx/sites-enabled/default \
  && ln -s ../sites-available/repograms /etc/nginx/sites-enabled/repograms \
  && echo "daemon off;" >> /etc/nginx/nginx.conf \
  && nginx -t
COPY conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN mkdir -p /var/log/supervisor

# Fill in placeholders in the served files
COPY build /root/build
RUN sed -i "s/@@@BUILDINFO@@@/`cat /root/build/buildinfo.autobuild`/" /var/www/public/index.html \
  && sed -i "s/@@@BUILDDATE@@@/`cat /root/build/builddate.autobuild`/" /var/www/public/icse2016/index.html \
  && if [ -f /root/build/extra-footer.html ]; then awk '{ if ($0 ~ /@@@EXTRAFOOTER@@@/) { while (getline < "/root/build/extra-footer.html") { print $0; } } else {print;} }' /var/www/public/index.html > /var/www/public/index.html.tmp && mv /var/www/public/index.html.tmp /var/www/public/index.html; fi \
  && if [ -f /root/build/example-states.js ]; then mv /root/build/example-states.js /var/www/public/scripts/example-states.js; fi \
  && if [ -f /root/build/credentials ]; then mv /root/build/credentials /var/www/build/credentials; fi \
  && rm -r /root/build
