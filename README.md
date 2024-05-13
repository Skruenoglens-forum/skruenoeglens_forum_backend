# UserManagementBackendNodejs

### **How to setup project in docker**
```bash
# Use docker-compose it runs MySQL DB, phpMyAdmin and usermanagement API
$ docker-compose up -d

# copy & paste dump.sql into MySQL db - http://localhost:8080

# Import Postman collection in Postman

$ sudo docker build -t [name] .

# Start container by running image
# 1. --name set name
# 2. -p set ports
# 3. -d run in background
$ sudo docker run --name=[name] -p 80:8888 -d [image name]

```

### **How to run node api**
```bash
# Use npm install
$ npm i

# Create .env file like this:
APP_PORT = 8585

DB_NAME=name
DB_USERNAME=root
DB_PASSWORD=pwd
DB_HOST=192.168.1.135
DB_PORT=3306

JWT_SECRET_KEY = secret

# Run api
$ node src/app.js


---
> *Created by - Emil Andersen - 2024*
