# Use a single stage to simplify and bypass compiler OOM issues
FROM node:22-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PORT=4000

# Copy ALL configuration files and source code (except what's in .dockerignore)
COPY . .

# Install dependencies INSIDE Docker so native extensions (like Prisma/bcrypt) are built for Linux
RUN npm install

# Generate the Linux Prisma client (locked to v5.22.0 to prevent v7 breaking changes)
RUN npx prisma@5.22.0 generate

# Build frontend explicitly (Vite is very fast and won't OOM)
RUN npm run build --prefix frontend

EXPOSE 4000

ENV NODE_ENV=production

# Start the application using tsx (bypasses tsc compiler memory crashes)
CMD ["npm", "start"]
