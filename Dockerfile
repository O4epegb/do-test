FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

RUN npm install pm2 -g --quiet

# Install app dependencies
# For npm@5 or later, copy package-lock.json as well
COPY package.json package-lock.json ./

RUN npm install --quiet

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "pm2-docker", "index.js" ]
