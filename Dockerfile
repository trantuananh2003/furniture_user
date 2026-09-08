# ----- Giai đoạn 1: Build ứng dụng React -----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ----- Giai đoạn 2: Tạo image production với Nginx -----
#nginx sẽ nằm trong container frontend user
FROM nginx:stable-alpine
# Copy các file tĩnh đã được build từ giai đoạn 1
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy file cấu hình Nginx cho React và copy vào để nginx.conf include default.conf
# nginx.conf này thật ra ko phải là nginx.conf trong nginx mà là viết vậy để copy vào default.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.local.conf /etc/nginx/conf.d/default.conf
# Mở cổng 80 để nhận request từ Nginx-Proxy
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]