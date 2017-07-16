FROM finanzcheck/docker-node-java

COPY . /dhbw/
RUN mkdir /dhbw/tmp && \
  chmod +x /dhbw/dhbw-run && \
  bash -c cd /dhbw && \
  npm install

EXPOSE 3000

CMD ["/dhbw/dhbw-run"]
