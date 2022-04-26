FROM node:14-alpine
WORKDIR /opt/app
ADD ["package.json", "package-lock.json*", "./"]
RUN npm install
ADD . .
CMD ["node", "app.js"]