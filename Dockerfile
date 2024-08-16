FROM nginx:1.21

RUN ls
RUN pwd

WORKDIR /app
COPY build .

RUN ls /app

COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN ls /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
