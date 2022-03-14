FROM node:14.17.6

WORKDIR /ndse-library

COPY ./package*.json ./

RUN npm install

COPY src/ ./src
COPY views/ ./views

CMD ["npm", "run", "dev"]

