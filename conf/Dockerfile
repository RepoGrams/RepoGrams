FROM ubuntu:20.04
LABEL org.opencontainers.image.authors="RepoGrams Team <github.com/RepoGrams/RepoGrams>"

# Install base utilities so we can use apt-key later
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y \
  gnupg2 \
  ca-certificates

# Add the apt repository for python3-graph-tool
RUN echo 'deb [arch=amd64] https://downloads.skewed.de/apt focal main' >> /etc/apt/sources.list
RUN apt-key adv --no-tty --keyserver keys.openpgp.org --recv-key 612DEFB798507F25

# Update apt and install dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y \
  python3 \
  python3-graph-tool \
  python3-pip \
  supervisor \
  python3-scipy \
  nginx

# Install the required Python libraries using pip, minus the libraries that were already installed using apt
COPY conf/requirements.txt /root/requirements.txt
RUN sed -e '/numpy/d' -e '/scipy/d' -i /root/requirements.txt \
  && pip3 install -r /root/requirements.txt \
  && rm /root/requirements.txt \
  && DEBIAN_FRONTEND=noninteractive apt-get purge -y python3-pip

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
  && rm -r /root/build
