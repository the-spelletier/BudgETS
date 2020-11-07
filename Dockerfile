FROM node:12

WORKDIR /app

COPY package*.json /app/

RUN npm install
RUN npm install -g sequelize-cli

COPY . /app

EXPOSE 3000
CMD ["npm","start"]
