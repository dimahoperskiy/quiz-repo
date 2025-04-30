# Сборочный этап
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

# Устанавливаем dev-зависимости для tsc
RUN npm install --include=dev

RUN npm run build

# Продакшн-этап
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
