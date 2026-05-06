FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_STRIPE_DIGITAL_PAYMENT_LINK
ARG VITE_STRIPE_CD_PAYMENT_LINK
ARG VITE_STRIPE_VINYL_PAYMENT_LINK
ARG VITE_API_BASE_URL=

ENV VITE_STRIPE_DIGITAL_PAYMENT_LINK=$VITE_STRIPE_DIGITAL_PAYMENT_LINK
ENV VITE_STRIPE_CD_PAYMENT_LINK=$VITE_STRIPE_CD_PAYMENT_LINK
ENV VITE_STRIPE_VINYL_PAYMENT_LINK=$VITE_STRIPE_VINYL_PAYMENT_LINK
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4242

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY server ./server
COPY private-downloads/README.md ./private-downloads/README.md

RUN mkdir -p server/data private-downloads

EXPOSE 4242

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4242/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server/index.js"]
