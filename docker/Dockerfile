FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY dashboard/package*.json ./dashboard/
RUN npm install --prefix dashboard

COPY backend/ .
COPY dashboard/ ./dashboard/
RUN npm run build --prefix dashboard

EXPOSE 5000

CMD ["node", "server.js"]