DROP DATABASE IF EXISTS skruenoeglen;

CREATE DATABASE skruenoeglen;

USE skruenoeglen;

DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS car;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS picture;

CREATE TABLE user_role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL
);

INSERT INTO user_role (name) VALUES 
('Admin'),
('User');

CREATE TABLE users (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    password LONGTEXT NOT NULL,
    description TEXT,
    profile_image TEXT,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (role_id) REFERENCES user_role(id)
);

CREATE TABLE car (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT(20) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    motor VARCHAR(128) NOT NULL,
    first_registration date NOT NULL,
    model VARCHAR(128) NOT NULL,
    type VARCHAR(128) NOT NULL,
    license_plate VARCHAR(128) NOT NULL,
    vin VARCHAR(128) NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL
);

INSERT INTO category (name) VALUES 
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
    user_id BIGINT(20) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    car_brand VARCHAR(128),
    car_motor VARCHAR(128),
    car_first_registration date,
    car_model VARCHAR(128),
    car_type VARCHAR(128),
    category_id INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE comment (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    description TEXT NOT NULL,
    solution TINYINT NOT NULL,
    user_id BIGINT(20) NOT NULL,
    post_id BIGINT(20) NOT NULL,
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
);

CREATE TABLE picture (
    id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    parent_id INT,
    path VARCHAR(128),
    parent_type VARCHAR(128)
);