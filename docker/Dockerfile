FROM node:carbon
VOLUME /usr/src/app/log
WORKDIR /usr/src/app
COPY package.json ./
COPY ts*.json ./
COPY ./conf ./conf
COPY ./lib ./lib
COPY ./messages ./messages
RUN npm i npm@latest -g
RUN npm run prod
EXPOSE 3000
CMD [ "npm", "start" ]