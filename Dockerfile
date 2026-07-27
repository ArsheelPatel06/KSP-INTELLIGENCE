FROM node:22-slim

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install

RUN cd backend && npx prisma generate

# Build BOTH frontend and backend
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "start"]
