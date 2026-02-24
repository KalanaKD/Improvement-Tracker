# 1. The Factory (Build the app)
FROM node:20-alpine AS builder

WORKDIR /app

# Bring the recipe and install dependencies
COPY package*.json ./

RUN npm install

# Bring in all the frontend code and  build it 
COPY . .

# TURN ON THE BLENDER! (This creates the /app/dist folder)
RUN npm run build

# 2. The Showroom (Serve the app)
FROM nginx:alpine

# Copy only the finished files from the 'builder' stage in to Nginx
# Note: 'dist' is the standard output folder,but sometimes it's build'.
COPY --from=builder /app/dist /usr/share/nginx/html

#Open port 80 (the standard port for web traffic)
EXPOSE 80

# Start Nginx waiter
CMD ["nginx", "-g", "daemon off;"]