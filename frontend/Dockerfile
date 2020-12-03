FROM node:12

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --network-timeout 1000000
RUN npm config rm proxy
RUN npm config rm https-proxy

COPY . .

CMD ["yarn", "start"]



