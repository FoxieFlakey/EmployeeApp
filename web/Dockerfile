FROM alpine:3.22

RUN adduser -S server

RUN apk update
RUN apk add nodejs npm

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# Pull necessary dependencies first
RUN npm install

# Copy source files
COPY . .

# Build the website
RUN npm run build

# host it!
EXPOSE 3000

CMD sh -c 'if [ -z "$DEV_MODE" ]; then su - server -c npm run start; else npm run dev; fi'

