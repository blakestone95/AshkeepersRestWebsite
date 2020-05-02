FROM node:12-alpine

# If we need to use node-gyp to build anything: https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine

# Set working directory
ENV PROJECT_DIR /home/node/project
WORKDIR ${PROJECT_DIR}

# Copy only what's necessary to build (to take advantage of caching)
COPY ./package.json ${WORKDIR}
COPY ./package-lock.json ${WORKDIR}

# Install packages
RUN npm install

# Copy entire codebase
# necessary so that we can use lint-staged properly during development
COPY . ${WORKDIR}

# Prepare output volume
VOLUME [ "${PROJECT_DIR}/client/dist" ]

# Build on up
CMD ["npm", "run", "build"]