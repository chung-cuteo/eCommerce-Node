# Use an official Node.js runtime as a parent image
FROM node:22-slim

RUN mkdir -p /usr/src/ecommerce-app

WORKDIR /usr/src/ecommerce-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
