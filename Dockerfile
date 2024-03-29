FROM node:16

ARG DATABASE_URL
ARG TOKEN_SECRET
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ENV DATABASE_URL=${DATABASE_URL} \
  TOKEN_SECRET=${TOKEN_SECRET} \
  CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \
  CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \
  CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

RUN mkdir -p /home/app
WORKDIR /home/app
COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]