FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Le proxy redirige /api vers le service API du docker-compose
ENV API_URL=http://pizza-eats-api:3000

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
