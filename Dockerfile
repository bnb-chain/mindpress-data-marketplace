FROM guergeiro/pnpm:18-8 as build-stage

WORKDIR /app

# COPY package.json /app
# COPY pnpm-lock.yaml /app

COPY . .

RUN pnpm install

ENV PUBLIC_URL https://static.nodereal.cc/static/gf-marketplace
ENV GENERATE_SOURCEMAP false
ENV REACT_APP_GF_EXPLORER_URL https://greenfieldscan.com/
ENV REACT_APP_BSC_EXPLORER_URL https://testnet.bscscan.com/
ENV REACT_APP_DCELLAR_URL https://testnet.dcellar.io/

ENV REACT_APP_GF_CHAIN_ID 5600
ENV REACT_APP_GF_RPC_URL https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org
ENV REACT_APP_BSC_RPC_URL https://data-seed-prebsc-1-s1.binance.org:8545
ENV REACT_APP_BSC_CHAIN_ID 97

ENV REACT_APP_MARKETPLACE_CONTRACT_ADDRESS 0xaa80E8Ee052BaA700c3Ca5b35ce5F02EeF02368d
ENV REACT_APP_GROUP_HUB_CONTRACT_ADDRESS 0x50B3BF0d95a8dbA57B58C82dFDB5ff6747Cc1a9E
ENV REACT_APP_MULTI_CALL_CONTRACT_ADDRESS 0x50f6210b85d38F5d0E660D6C8978C9bdCd12F130
ENV REACT_APP_ERC1155_TRANSFER_CONTRACT_ADDRESS 0x43bdF3d63e6318A2831FE1116cBA69afd0F05267
ENV REACT_APP_ERC721_TRANSFER_CONTRACT_ADDRESS 0x7fC61D6FCA8D6Ea811637bA58eaf6aB17d50c4d1

ENV REACT_APP_NETWORK Testnet

ENV REACT_APP_DAPP_NAME mindt1020

ENV G_TAG G-SHLTDD3YG4

ENV REACT_APP_API_DOMAIN https://gnfd-testnet-marketplace.bnbchain.org/v1/

RUN npm run build

RUN echo 'build successful'

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.21
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
# COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

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
