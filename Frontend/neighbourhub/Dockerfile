# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/neighbourhub/ /tmp/neighbourhub-dist/

RUN rm -rf /usr/share/nginx/html/* && \
	if [ -d /tmp/neighbourhub-dist/browser ]; then \
		cp -r /tmp/neighbourhub-dist/browser/. /usr/share/nginx/html/; \
	else \
		cp -r /tmp/neighbourhub-dist/. /usr/share/nginx/html/; \
	fi

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
