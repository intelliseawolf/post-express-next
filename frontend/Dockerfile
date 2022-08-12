FROM node:current-alpine

WORKDIR /usr/src/post-app/frontend

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]