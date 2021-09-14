use Semi1;
select * from usuario;
insert into usuario values(0,"Audrie","Audrie8a","ann.audrie8a@gmail.com","Rodaudrie","Foto");
insert into usuario values(0,"Sergio","SergioDC","seresdo@gmail.com","Rodaudrie","Foto");
insert into usuario values(0,"Johanna","Joha8a","Joha8a@gmail.com","Rodaudrie","Foto");
insert into usuario values(0,"Alejandro","Ale8a","Ale8a@gmail.com","Rodaudrie","Foto");
insert into usuario values(0,"Anne","Anne8a","anne8a@gmail.com","Rodaudrie","Foto");


-- Mostrar sugerencias
select u.idUser, u.nombre, u.usuario, u.correo, u.contra, u.foto from usuario as u 
where  u.idUser not in 
(select user1 from Amigo
where user2=2)
and u.idUser not in 
(select user2 from Amigo
where user1=2)
and u.idUser!=2
and u.usuario="Rod8a";

select * from archivo;
select count(*) as Total from archivo where idUsu in (3,4,5,7,8,0) and Estado=1;

-- Mostrar Amigos
select idUser, nombre, usuario, correo, contra, foto from usuario as u
where idUser in 
(select user1 from Amigo
where user2=1
and estado=0)
or idUser in 
(select user2 from Amigo
where user1=1
and estado=0)
;

-- Mis Solicitudes
select idUser, nombre, usuario, correo, contra, foto from usuario, Amigo
where user1=idUser
and user2=1
and estado=2;



-- valores: emisor, receptor, estado: Aceptado=0, Rechazado=1, Esperando=2
-- Solicitud de Amistad en espera
insert into Amigo values(1,2,2); -- Audrie a Diego
insert into Amigo values(1,4,2); -- Audrie a Sergio
insert into Amigo values(5,1,2); -- Alejandor a Audrie
-- Solicitud de Amistad aprobada
insert into Amigo values(1,3,0); -- Audrie a Rodrigo
insert into Amigo values(1,7,0); -- Audrie a Johanna
insert into archivo values(0,"Prueba","...",0,1);


select idUser, nombre, usuario, correo, contra, foto from usuario as u
            where usuario in
            (select user1 from Amigo
            where user2=1
            and estado=0)
            and idUser in
            (select user2 from Amigo
            where user1=1
            and estado=0)
            or usuario="Toto";


select * from Amigo;
delete from Amigo where user1 =5 and user2=1;
update Amigo SET estado=0 where user1=5 and user2= 1;
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

