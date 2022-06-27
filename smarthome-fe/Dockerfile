FROM node:16-alpine

LABEL title="smarthome-fe" \
  description="Next App"

RUN mkdir -p /usr/app
WORKDIR /usr/app

ADD components components
ADD lib lib
ADD pages pages
ADD public public
ADD styles styles
ADD .env.local .
ADD .eslintrc.json .
ADD next-env.d.ts .
ADD next.config.js .
ADD package.json .
ADD tsconfig.json .

RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
