FROM node:14.17.6

WORKDIR /app/ndse-library

COPY ./package*.json ./

RUN npm install

COPY . /app/ndse-library

CMD ["npm", "run", "dev"]

