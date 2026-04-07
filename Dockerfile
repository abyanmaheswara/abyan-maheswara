# Gunakan image Nginx versi alpine yang ringan
FROM nginx:alpine

# Copy seluruh file website statis ke direktori default Nginx
COPY . /usr/share/nginx/html/

# Expose port 80 untuk akses web
EXPOSE 80

# Perintah untuk menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
