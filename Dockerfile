# https://hackernoon.com/5-steps-for-dockerizing-nestjs-with-prisma
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --force
COPY . .
RUN npx prisma generate
ARG DATABASE_URL
RUN npm run build

FROM node:18
WORKDIR /app
COPY --chown=node:node --from=build /app/. .
RUN npm install --omit=dev --force
COPY --chown=node:node --from=build /app/node_modules/.prisma/client  ./node_modules/.prisma/client

ENV NODE_ENV production
ARG DATABASE_URL
EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]