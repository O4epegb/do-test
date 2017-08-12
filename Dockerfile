FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# For npm@5 or later, copy package-lock.json as well
COPY package.json package-lock.json ./

RUN npm install pm2 -g
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "pm2-docker", "index.js" ]
