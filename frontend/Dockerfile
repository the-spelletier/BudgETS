FROM node:12

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

COPY . /app

RUN yarn install --network-timeout 1000000
RUN npm config rm proxy
RUN npm config rm https-proxy

CMD ["yarn", "start"]



