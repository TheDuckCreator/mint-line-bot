
FROM node:18-alpine

# Working Directory
RUN mkdir /home/node/app
WORKDIR /home/node/app

# Copy Package.json
COPY . /home/node/app/
RUN npm ci
RUN npm install -g pm2
EXPOSE 3004

CMD [ "pm2-runtime","server.js" ]