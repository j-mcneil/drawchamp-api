FROM node:12 as build

# Create src directory
WORKDIR /src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci --ignore-scripts
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build
RUN ls


FROM build as final
# create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production --ignore-scripts

COPY --from=build /src/dist ./

EXPOSE 3000

CMD [ "node", "src/index.js" ]
