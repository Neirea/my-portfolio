# stage 1
FROM node:16 as builder
WORKDIR /portfolio
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test:prod
RUN npm run build
RUN npm prune --omit=dev

# stage 2
FROM node:16-alpine
ENV NODE_ENV production
WORKDIR /portfolio

COPY --from=builder /portfolio/node_modules /portfolio/node_modules
COPY --from=builder /portfolio/build /portfolio
CMD node index.js