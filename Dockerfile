FROM node:8

ENV PORT 3001

EXPOSE 3001

COPY package.json package.json
RUN npm install

COPY ./dist ./dist
RUN npm run build

CMD ["node", "dist/"]