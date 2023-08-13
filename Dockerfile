
FROM node:14-alpine


WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm uninstall express
RUN npm uninstall @sendgrid/mail
RUN npm uninstall axios
RUN npm uninstall express-fileupload
RUN npm uninstall joi
RUN npm uninstall jsonwebtoken
RUN npm uninstall mongoose
RUN npm uninstall multer
RUN npm uninstall node-cache
RUN npm uninstall swagger-jsdoc
RUN npm uninstall swagger-ui-express
RUN npm uninstall uuid
RUN npm uninstall bcrypt
RUN npm uninstall cors
RUN npm uninstall dotenv
RUN npm uninstall openai




RUN npm install express
RUN npm install @sendgrid/mail
RUN npm install axios
RUN npm install express-fileupload
RUN npm install joi
RUN npm install jsonwebtoken
RUN npm install mongoose
RUN npm install multer
RUN npm install node-cache
RUN npm install swagger-jsdoc
RUN npm install swagger-ui-express
RUN npm install uuid
RUN npm install bcrypt
RUN npm install cors
RUN npm install dotenv
RUN npm install openai

COPY . .

EXPOSE 3001

CMD ["node","app.js"]