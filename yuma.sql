CREATE DATABASE vivero;

USE vivero;

-- Tabla de catálogo
CREATE TABLE catalogo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL
);

-- Insertar datos ficticios en el catálogo
INSERT INTO catalogo (nombre, categoria, precio) VALUES
('Rosa', 'Plantas de jardín', 50.00),
('Margarita', 'Plantas de jardín', 35.00),
('Lavanda', 'Plantas silvestres', 25.00),
('Tomate', 'Plantas para cosecha', 15.00),
('Orégano', 'Plantas para cos	echa', 10.00);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    planta VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL
);

-- Insertar datos ficticios en pedidos
INSERT INTO pedidos (cliente, planta, cantidad, total) VALUES
('Juan Pérez', 'Rosa', 5, 250.00),
('María Gómez', 'Lavanda', 10, 250.00),
('Carlos Díaz', 'Tomate', 20, 300.00);
