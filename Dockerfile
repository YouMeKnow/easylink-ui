FROM node:20-bullseye AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_AMPLITUDE_API_KEY
ENV VITE_AMPLITUDE_API_KEY=$VITE_AMPLITUDE_API_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
