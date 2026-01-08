# Thay đổi từ node:18-alpine sang node:20-alpine hoặc node:22-alpine
FROM node:20-alpine

# Các bước còn lại giữ nguyên
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

# Bước này sẽ hết lỗi với Node 20+
RUN npx prisma generate

# Nếu bạn đang học, có thể tạm bỏ qua lệnh build để chạy dev cho nhanh
# RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]