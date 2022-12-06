FROM node:14.16-alpine as builder

WORKDIR /srv/
COPY . /srv/
RUN npm install
ENTRYPOINT ["npm", "start"]