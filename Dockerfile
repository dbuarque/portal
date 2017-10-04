FROM nginx

RUN apt-get update
RUN apt-get -f install
RUN apt-get install -y wget

# install confd
RUN wget -nv -O /usr/local/bin/confd https://github.com/kelseyhightower/confd/releases/download/v0.12.0/confd-0.12.0-linux-amd64
RUN chmod +x /usr/local/bin/confd

ADD confd /etc/confd

ADD dist /usr/share/nginx/html

ADD entry.sh /
ENTRYPOINT ["/entry.sh"]
