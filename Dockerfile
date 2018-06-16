FROM node:carbon
WORKDIR /usr/src/app
VOLUME /usr/src/app/log
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]