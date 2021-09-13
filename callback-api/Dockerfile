FROM node:carbon

ARG WORKDIR=/home/datahog
WORKDIR ${WORKDIR}

ARG CALLBACK_API_DIR=callback-api

RUN apt-get update -qq

RUN npm install -g yarn --force
RUN chmod +x /usr/local/bin/yarn

COPY ./${CALLBACK_API_DIR}/package.json ./${CALLBACK_API_DIR}/yarn.lock ./${CALLBACK_API_DIR}/

# Only needed for dev
RUN apt-get install -y lsof

COPY package.json yarn.lock ./

ADD ./${CALLBACK_API_DIR}/src ./${CALLBACK_API_DIR}/src

WORKDIR ${WORKDIR}/${CALLBACK_API_DIR}

RUN yarn --production

EXPOSE 3003

CMD [ "node", "src/server.js" ]
