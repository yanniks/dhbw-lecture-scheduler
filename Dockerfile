FROM finanzcheck/docker-node-java

COPY dhbw-run java/ index.js package.json parseLectureSchedule/ protobuf.js protos/ socket.js /dhbw/
RUN mkdir /dhbw/tmp
RUN chmod +x /dhbw/dhbw-run

CMD ["/dhbw/dhbw-run"]
