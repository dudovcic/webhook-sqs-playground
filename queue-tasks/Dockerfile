FROM node:carbon

ARG WORKDIR=/home/queue-tasks
WORKDIR ${WORKDIR}

ARG TASKS_DIR=queue-tasks

RUN apt-get update -qq

RUN npm install -g yarn --force
RUN chmod +x /usr/local/bin/yarn

ADD ./tsconfig.json ./tsconfig.json
COPY ./${TASKS_DIR}/package.json ./${TASKS_DIR}/yarn.lock ./${TASKS_DIR}/tsconfig.json ./${TASKS_DIR}/

# Only needed for dev
RUN apt-get install -y lsof

COPY package.json yarn.lock ./

ADD ./${TASKS_DIR}/src ./${TASKS_DIR}/src

WORKDIR ${WORKDIR}/${TASKS_DIR}

RUN yarn --production

RUN yarn build

CMD [ "node", "build/index.js" ]
