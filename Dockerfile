FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache git netcat-openbsd
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]