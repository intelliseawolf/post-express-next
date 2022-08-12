FROM node:current-alpine

WORKDIR /usr/src/post-app/backend

COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 5000

CMD ["npm", "run", "dev"]