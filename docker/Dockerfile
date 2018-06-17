FROM node:carbon
WORKDIR /usr/src/app
VOLUME /usr/src/app/log
COPY package*.json ./
RUN npm install
COPY ./conf ./conf
COPY ./dist ./dist
COPY ./messages ./messages
EXPOSE 3000
CMD [ "npm", "start" ]