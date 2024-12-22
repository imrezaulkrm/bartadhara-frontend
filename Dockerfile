# Use the official Nginx image as the base image
FROM nginx:stable-alpine3.20-perl

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy your website files (HTML, CSS, JS) to the Nginx default directory
COPY . /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
