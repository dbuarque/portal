FROM nginx

COPY scripts /scripts
COPY build-development /build-development
COPY build-production /build-production
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /scripts/run.sh

EXPOSE 80

ENTRYPOINT ["/scripts/run.sh"]
