FROM node:latest
WORKDIR /src/app.jsx

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm","run","dev"]