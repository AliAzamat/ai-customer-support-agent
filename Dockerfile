# Build the TypeScript, then run the compiled output.
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build            # tsc → dist/

FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev        # runtime deps only
COPY --from=build /app/dist ./dist
# OPENAI_API_KEY is injected at runtime — NEVER baked into the image.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
