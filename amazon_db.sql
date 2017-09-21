-- Steven Sober
-- 09/21/2017
-- Homework - Bamazon
-- amazon_db.sql

DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

use bamazon_db;

create table products (
	item_id integer(10) auto_increment not null,
	product_name varchar(50),
    department_name varchar(50),
    price double(10,2),
    stock_quantity integer(10),
    primary key(item_id)
    );

insert into products (product_name, department_name, price, stock_quantity) values
	("Destiny 2", "Video Games", 59.99, 100),
	("Overwatch", "Video Games", 29.99, 100),
    ("Dualshock 4", "Gaming Accessories", 64.99, 50),
    ("Samsung 60 OLED TV", "Televisions", 499.99, 50),
    ("NETGEAR Nighthawk 1900", "Networking", 129.99, 100),
    ("ViewSonic 24 LED", "Monitors", 209.99, 50),
    ("3' HDMI Cable", "Networking", 5.49, 250),
    ("6' HDMI Cable", "Networking", 8.49, 250),
    ("PS4 Pro - 1 TB", "Game Consoles", 399.99, 75),
    ("PS4 Slim - 500 GB", "Game Consoles", 299.99, 75);

select * from products;
