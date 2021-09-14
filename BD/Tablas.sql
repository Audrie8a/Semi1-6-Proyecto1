use Semi1;
select * from usuario;
insert into usuario values(0,"Audrie","Audrie8a","ann.audrie8a@gmail.com","Rodaudrie","Foto");

create table usuario(
	idUser int not null auto_increment primary key,
	nombre varchar(40),
	usuario varchar(16) unique,
	correo varchar(35),
	contra varchar(50),
	foto varchar(300)
);

create table archivo(
	idArchivo int not null auto_increment primary key,
	nombreArch varchar(300),
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

