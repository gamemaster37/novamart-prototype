FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm install
RUN npm install --prefix client
RUN npm install --prefix server

COPY . .

RUN mkdir -p /app/data
RUN chmod +x /app/docker-entrypoint.sh

ENV DATABASE_PATH=/app/data/novamart-crm.sqlite
ENV BACKEND_PORT=8080
ENV NODE_ENV=development

EXPOSE 80

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
