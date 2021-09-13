FROM node:carbon

ARG WORKDIR=/home/datahog
WORKDIR ${WORKDIR}

ARG DATAHOG_DIR=datahog

RUN apt-get update -qq

RUN npm install -g yarn --force
RUN chmod +x /usr/local/bin/yarn

COPY ./${DATAHOG_DIR}/package.json ./${DATAHOG_DIR}/yarn.lock ./${DATAHOG_DIR}/

# Only needed for dev
RUN apt-get install -y lsof

COPY package.json yarn.lock ./

ADD ./${DATAHOG_DIR}/src ./${DATAHOG_DIR}/src

WORKDIR ${WORKDIR}/${DATAHOG_DIR}

RUN yarn --production

EXPOSE 3000

CMD [ "node", "src/server.js" ]
