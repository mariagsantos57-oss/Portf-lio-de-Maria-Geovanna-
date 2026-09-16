
CREATE DATABASE sistema_login;

USE sistema_login;

CREATE TABLE usuarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
usuario VARCHAR(100) NOT NULL UNIQUE,
 login VARCHAR(50) NOT NULL,
 senha VARCHAR(50) NOT NULL
data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (login, senha) VALUES ('Maria Geovanna', '123'); 
INSERT INTO usuarios (login, senha) VALUES ('professor', '1234'); 

