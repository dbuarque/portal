FROM nginx

# install confd
ADD install.sh /
RUN /install.sh

ADD confd /etc/confd

ADD dist /usr/share/nginx/html

ADD entry.sh /
ENTRYPOINT ["/entry.sh"]
