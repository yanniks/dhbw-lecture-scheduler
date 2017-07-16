FROM finanzcheck/docker-node-java

COPY . /dhbw
RUN mkdir /dhbw/tmp

CMD ["/dhbw/dhbw-run"]
