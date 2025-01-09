CREATE DATABASE IF NOT EXISTS PaperPlane;

USE PaperPlane;

CREATE TABLE IF NOT EXISTS Supplier (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Category (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Product (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    id_category INT NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_category) REFERENCES Category(id)
);

CREATE TABLE IF NOT EXISTS Supplier_product (
    supplier_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (supplier_id, product_id),
    FOREIGN KEY (supplier_id) REFERENCES Supplier(id),
    FOREIGN KEY (product_id) REFERENCES Product(id)
);

CREATE TABLE IF NOT EXISTS Client (
    id INT NOT NULL AUTO_INCREMENT,
    lastname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    address VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `Order` (
    id INT NOT NULL AUTO_INCREMENT,
    client_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('créée', 'en cours', 'en livraison', 'livrée', 'annulée') NOT NULL,
    price_total DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (client_id) REFERENCES Client(id)
);

CREATE TABLE IF NOT EXISTS Ligne_order (
    `order_id` INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (`order_id`, product_id),
    FOREIGN KEY (`order_id`) REFERENCES `Order`(id),
    FOREIGN KEY (product_id) REFERENCES Product(id)
);