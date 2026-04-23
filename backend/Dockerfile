FROM golang:1.26-alpine3.22 AS builder

WORKDIR /src

# Update dependencies ONLY copies the go.mod and go.smu
# so building doesnt requires redownload all deps
COPY go.sum .
COPY go.mod .

RUN go mod download

# Then we can get the rest of source code and build
COPY . .
RUN go build

# then the runner container
FROM alpine:3.22

RUN adduser -S server

WORKDIR /app
COPY --from=builder /src/backend backend

USER server
CMD ["/app/backend"]


