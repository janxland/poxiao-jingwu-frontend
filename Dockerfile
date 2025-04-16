# 构建阶段
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
# 安装 pnpm
RUN npm install -g pnpm
RUN pnpm install
COPY . .
# 这里不再在构建时设置环境变量的值
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN pnpm run build

# 运行阶段
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# 添加一个脚本来处理环境变量
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh
# 安装 pnpm 并只安装生产依赖
RUN npm install -g pnpm && pnpm install --prod
EXPOSE 9000
# 使用入口脚本启动服务
ENTRYPOINT ["/app/docker-entrypoint.sh"]
# 使用 pnpm preview 命令启动服务
CMD ["pnpm", "preview", "--port", "9000", "--host"]