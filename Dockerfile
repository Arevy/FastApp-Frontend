# Build Stage
FROM node:16.15.1 AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ARG REACT_APP_PROTOCOL
ARG REACT_APP_HOST
ARG REACT_APP_PORT
ARG REACT_APP_GRAPHQL
RUN yarn build

# Production Stage
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
