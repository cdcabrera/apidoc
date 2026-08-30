# Containerfile for apidoc
FROM node:22-alpine

ARG APIDOC_VERSION=latest

LABEL org.opencontainers.image.title="apidoc" \
      org.opencontainers.image.description="RESTful web API Documentation Generator" \
      org.opencontainers.image.url="https://apidocjs.com" \
      org.opencontainers.image.source="https://github.com/cdcabrera/apidoc" \
      org.opencontainers.image.licenses="MIT"

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin

USER node

RUN mkdir -p /home/node/apidoc

WORKDIR /home/node/apidoc

RUN npm install -g @cdcabrera/apidoc@${APIDOC_VERSION} --omit=dev --no-audit --no-fund \
    && npm cache clean --force

ENTRYPOINT ["apidoc"]
