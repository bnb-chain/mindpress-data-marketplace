FROM nginx:1.21

RUN ls
RUN pwd

WORKDIR /app
COPY build .

RUN ls /app

RUN rm /usr/share/nginx/html
COPY build /usr/share/nginx/html

RUN ls /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# RUN npm i -g pnpm

# WORKDIR /app

# COPY package.json ./
# COPY pnpm-lock.yaml ./

# RUN pnpm install

# COPY . .

# EXPOSE 80

# CMD ["pnpm", "start"]



# FROM node:18-alpine as builder
# # ENV PNPM_HOME="/pnpm"
# # ENV PATH="$PNPM_HOME:$PATH"
# # RUN corepack enable

# RUN npm i -g pnpm
# # Set the working directory to /app inside the container
# WORKDIR /app
# # Copy app files
# COPY package.json ./
# COPY pnpm-lock.yaml ./
# # Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# RUN pnpm install --prod --frozen-lockfile
# # Build the app
# RUN pnpm run build

# # Bundle static assets with nginx
# FROM nginx:1.21.0-alpine as production
# # RUN rm /etc/nginx/conf.d/default.conf
# # RUN rm /usr/share/nginx/html/index.html
# ENV NODE_ENV production
# # Copy built assets from `builder` image
# COPY --from=builder /app/build /usr/share/nginx/html
# # Add your nginx.conf
# # COPY nginx.conf /etc/nginx/conf.d/default.conf
# # Expose port
# EXPOSE 80
# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]
