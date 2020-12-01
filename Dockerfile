FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g sequelize-cli
COPY . .

EXPOSE 3000
ENV NODE_ENV production
CMD ["npm","start"]
