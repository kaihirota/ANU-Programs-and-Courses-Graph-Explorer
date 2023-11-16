FROM node:16

RUN mkdir -p /app
WORKDIR /app

COPY --chown=node:node package.json .
RUN npm install
COPY . .

COPY --chown=node:node . .
USER node

EXPOSE 3000

CMD ["npm", "start"]
