# Simple multi-stage build for frontend only (contracts run via hardhat locally)
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm ci || npm i
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/frontend/dist ./dist
RUN npm i -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
