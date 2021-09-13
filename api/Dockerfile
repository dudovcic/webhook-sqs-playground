FROM node:carbon

ARG WORKDIR=/home/api
WORKDIR ${WORKDIR}

ARG API_DIR=api

RUN apt-get update -qq

RUN npm install -g yarn --force
RUN chmod +x /usr/local/bin/yarn

ADD ./tsconfig.json ./tsconfig.json
COPY ./${API_DIR}/package.json ./${API_DIR}/yarn.lock ./${API_DIR}/tsconfig.json ./${API_DIR}/

# Only needed for dev
RUN apt-get install -y lsof

COPY package.json yarn.lock ./

ADD ./${API_DIR}/src ./${API_DIR}/src

WORKDIR ${WORKDIR}/${API_DIR}

RUN yarn --production

RUN yarn build

EXPOSE 4000

CMD [ "node", "build/index.js" ]
