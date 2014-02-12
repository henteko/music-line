FROM ubuntu:12.10
MAINTAINER henteko

RUN sudo apt-get update
RUN sudo apt-get install -y git curl build-essential libssl-dev
RUN sudo apt-get install -y python-software-properties python g++ make software-properties-common
RUN sudo add-apt-repository ppa:chris-lea/node.js

RUN sudo apt-get update
RUN sudo apt-get install -y nodejs

ADD server.js /opt/music_line/server.js
ADD index.html /opt/music_line/index.html
ADD js /opt/music_line/js
ADD sounds /opt/music_line/sounds
WORKDIR /opt/music_line

RUN npm install express

EXPOSE 8080
CMD ["node", "/opt/music_line/server.js"]
