FROM ubuntu:14.04
MAINTAINER Repograms Team <github.com/HeikoBecker/Repograms>
RUN apt-get update 
RUN apt-get install -y wget
#first install dependencies, python2, networkx for python2, apache2, php and git
RUN echo 'deb http://downloads.skewed.de/apt/trusty trusty universe' >> /etc/apt/sources.list
RUN echo 'deb-src http://downloads.skewed.de/apt/trusty trusty universe' >> /etc/apt/sources.list
#RUN wget http://pgp.skewed.de:11371/pks/lookup?op=get&search=0x612DEFB798507F25 --output-document=pubkey
COPY pubkey pubkey
RUN apt-key add pubkey
RUN DEBIAN_FRONTEND=noninteractive apt-get update 
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y software-properties-common
RUN DEBIAN_FRONTEND=noninteractive add-apt-repository ppa:dennis/python
RUN apt-get update
RUN mkdir -p /var/www/html
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y subversion mercurial-git python python-graph-tool supervisor python-cherrypy3 libgit2 python-pygit2 nginx apache2
#empty the destination folder
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
ADD nginx.conf /etc/nginx/conf.d/repograms.conf
#copy the project to the www folder
RUN rm -r /var/www/html/*
ADD ./ /var/www/html/
RUN sed -i "s/@@@BUILDINFO@@@/`cat /var/www/html/.buildinfo`/g" /var/www/html/index.html
#add additinoal apache conf
RUN nginx -t
RUN mkdir -p /var/lock/apache2 /var/run/apache2 /var/log/supervisor
#Cope the config file
ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf
#Make the container run the apache webserver
#CMD ["/bin/bash -c 'supervisord -c /etc/supervisor/conf.d/supervisord.conf'"]
