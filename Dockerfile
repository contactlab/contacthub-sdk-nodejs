FROM node:6

ADD ./package.json /contacthub-sdk-nodejs/package.json
WORKDIR /contacthub-sdk-nodejs
RUN npm -q i
ADD . /contacthub-sdk-nodejs

CMD npm -q test
