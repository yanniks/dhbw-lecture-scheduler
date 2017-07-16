FROM finanzcheck/docker-node-java

COPY . /dhbw/
RUN mkdir /dhbw/tmp
RUN chmod +x /dhbw/dhbw-run

CMD ["/dhbw/dhbw-run"]
