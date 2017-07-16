FROM finanzcheck/docker-node-java

COPY . /dhbw/
RUN mkdir /dhbw/tmp
RUN chmod +x /dhbw/dhbw-run

EXPOSE 80

CMD ["/dhbw/dhbw-run"]
