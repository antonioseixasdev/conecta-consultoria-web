# Use uma versão do Node.js compatível (ex: Node 18)
FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]