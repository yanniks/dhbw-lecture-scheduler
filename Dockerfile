FROM finanzcheck/docker-node-java

COPY . /dhbw
RUN mkdir /dhbw/tmp

CMD ["cd /dhbw && node index.js"]