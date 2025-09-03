FROM golang:1.23-alpine

WORKDIR /app

# Install air for live reload
RUN go install github.com/cosmtrek/air@v1.49.0

# Install migrate tool
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Copy go.mod and download dependencies
COPY go.mod ./
RUN go mod download

# Copy the .env file
COPY .env ./

# Copy the rest of the code
COPY . .

# Create tmp directory for air
RUN mkdir -p tmp

# Expose port
EXPOSE 8080

# Command to run the application with hot reloading
CMD ["air", "-c", ".air.toml"] 