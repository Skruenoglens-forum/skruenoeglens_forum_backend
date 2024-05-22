DROP DATABASE IF EXISTS skruenoeglen;

CREATE DATABASE skruenoeglen;

USE skruenoeglen;

DROP TABLE IF EXISTS userRole;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS car;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS picture;

CREATE TABLE userRole (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userRoleName VARCHAR(128) NOT NULL
);

INSERT INTO userRole (userRoleName) VALUES 
('Admin'),
('User');

CREATE TABLE users (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    password LONGTEXT NOT NULL,
    description TEXT,
    roleId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (roleId) REFERENCES userRole(id)
);

CREATE TABLE car (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT(20) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    motor VARCHAR(128) NOT NULL,
    firstRegistration date NOT NULL,
    model VARCHAR(128) NOT NULL,
    type VARCHAR(128) NOT NULL,
    licensePlate VARCHAR(128) NOT NULL,
    vin VARCHAR(128) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoryName VARCHAR(128) NOT NULL
);

INSERT INTO category (categoryName) VALUES 
('Motor'),
('Gearkasse'),
('Bremser'),
('Undervogn'),
('Udstødning'),
('Karosseri'),
('Kølesystem'),
('Brændstofsystem'),
('Elektriske systemer'),
('Andet');

CREATE TABLE post (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT(20) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    carBrand VARCHAR(128),
    carMotor VARCHAR(128),
    carFirstRegistration date,
    carModel VARCHAR(128),
    carType VARCHAR(128),
    parentId INT DEFAULT 0,
    categoryId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (categoryId) REFERENCES category(id)
);

CREATE TABLE picture (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    parentId INT,
    path VARCHAR(128),
    parentType VARCHAR(128)
);