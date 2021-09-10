create database Semi1;

use  Semi1;

create table Prueba(
	Nombre Varchar(50)
);

insert into Prueba values ("Audrie");
insert into Prueba values("Annelisse");
select * from Prueba;

create table usuario(
	idUser int not null auto_increment primary key,
	nombre varchar(40),
	usuario varchar(16),
	correo varchar(35),
	contra varchar(16),
	foto varchar(300)
);

create table archivo(
	idArchivo int not null auto_increment primary key,
	nombreArch varchar(30),
	Arch varchar(300),
	Estado int,
	idUsu int,
	CONSTRAINT fk_use FOREIGN KEY (idUsu)
        REFERENCES usuario (idUser)
);

create table Amigo(
	user1 int,
	user2 int,
	estado int,
	CONSTRAINT fk_usu1 FOREIGN KEY (user1)
        REFERENCES usuario (idUser),
	CONSTRAINT fk_usu2 FOREIGN KEY (user2)
        REFERENCES usuario (idUser)
);


