FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["npm", "run", "dev", "--", "-p", "3000", "-H", "0.0.0.0"]
