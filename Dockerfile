FROM registry.access.redhat.com/ubi8/nodejs-14

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8443

## Uncomment the below line to update image security content if any
USER root
# RUN dnf -y update-minimal --security --sec-severity=Important --sec-severity=Critical && dnf clean all

# USER default

RUN npm run build

ENV NODE_ENV=staging

LABEL name="ibm/wa-react" \
    vendor="IBM" \
    version=".1" \
    release="1" \
    summary="This is a container image." \
    description="This container image will deploy The UPS Developer Assistant"

CMD ["npm", "run", "deploy"]