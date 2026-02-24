#1. Foundation
FROM node:20-alpine

#2. Workspace
WORKDIR /app

#3. The Recipe Book
COPY package*.json ./

#4. Hiring the chefs 
RUN npm install

#5. Bringing the equipments
COPY . .

#6. Opening the door 
EXPOSE 3000

#7. Opening for business 
CMD ["npm","start"]