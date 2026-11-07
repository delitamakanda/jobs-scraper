# Local development image for the Angular SPA (not for production).
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# The source is bind-mounted by docker-compose.yml for hot reload.
COPY . .

EXPOSE 4200
# --poll: file watching on bind mounts is unreliable without polling.
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--configuration", "development", "--poll", "2000"]
