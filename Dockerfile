FROM nginx:1.21

RUN ls
RUN pwd

WORKDIR /app
COPY build .

RUN ls /app

COPY build /usr/share/nginx/html

RUN ls /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
