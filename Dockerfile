FROM node:16.14.0

WORKDIR /app

ARG NODE_ENV=production

COPY ./yarn*.lock ./
COPY package*.json ./
RUN npm install

COPY ./src/ ./src

ENTRYPOINT ["yarn", "start"]

