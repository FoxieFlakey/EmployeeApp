FROM alpine:3.22

RUN adduser -S server -s /bin/sh

RUN apk update
RUN apk add nodejs npm

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# Pull necessary dependencies first
RUN npm install

# Copy source files
COPY . .

ARG WEB_HOSTNAME
ARG WEB_PORT
ENV NEXT_PUBLIC_WEB_HOSTNAME=$WEB_HOSTNAME
ENV NEXT_PUBLIC_WEB_PORT=$WEB_PORT

ARG API_HOSTNAME
ARG API_PORT
ENV NEXT_PUBLIC_API_HOSTNAME=$API_HOSTNAME
ENV NEXT_PUBLIC_API_PORT=$API_PORT

# Build the website
RUN npm run build

# host it!
EXPOSE 3000

CMD sh -c 'if [ "$DEV_MODE" == "1" ]; then su - server -c npm run dev; else su server -c "cd /app; npm run start"; fi'

