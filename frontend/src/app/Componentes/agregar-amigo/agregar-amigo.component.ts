import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgregarAmigoService } from 'src/app/Servicios/agregar-amigo.service';

@Component({
  selector: 'app-agregar-amigo',
  templateUrl: './agregar-amigo.component.html',
  styleUrls: ['./agregar-amigo.component.css']
})
export class AgregarAmigoComponent implements OnInit {
  
  Anuncio1:string="";
  Anuncio2:string="";
  Anuncio3:string="";

  Filtro1:string ="";
  Filtro2:string ="";
  Filtro3:string ="";

  idUsuarioGlobal:string | null="";
  Amigos: any;
  Sugerencias: any;
  Solicitudes: any;

  constructor(public _routre:Router,
    public route: ActivatedRoute,
    public agregarAmigoServicio: AgregarAmigoService) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
    this.Inicio(this.idUsuarioGlobal)
  }

  
  Inicio(usuario: string | null){
    this.borrarRegistros()
    if(usuario!=null){
      this.getAmigos("",0);
      this.getSugerencias("",0);
      this.getSolicitudes("",0);

    }
  }

  async getAmigos(Usuario2:string,tipo:Number){    
    let aux= await this.agregarAmigoServicio.getAmigos(this.idUsuarioGlobal,Usuario2,tipo);

    if(aux!='false'){
      let json=JSON.stringify(aux)
      let obj= JSON.parse(json)
    
      this.Amigos=obj;
    }else{
      this.Anuncio1="No cuentas con amigos agregados, agrega unos cuantos ;) !";
    }
    this.Filtro1="";
    
  }

  async getSugerencias(Usuario2:string,tipo:Number){
    let aux= await this.agregarAmigoServicio.getSugerencias(this.idUsuarioGlobal,Usuario2,tipo);
    if(aux!='false'){
      let json=JSON.stringify(aux)
      let obj= JSON.parse(json)
      
      this.Sugerencias=obj;
    }else{
      this.Anuncio2="Por el momento no existen sugerencias para nuevos amigos :(  !";
    }
    this.Filtro2="";
  }

  async getSolicitudes(Usuario2:string,tipo:Number){
    
    let aux= await this.agregarAmigoServicio.getSolicitudes(this.idUsuarioGlobal,Usuario2,tipo);
    if(aux!='false'){
      let json=JSON.stringify(aux)
      let obj= JSON.parse(json)
      
      this.Solicitudes=obj;
    }else{
      this.Anuncio3="Por el momento, no cuentas con neuvas solicitudes de amistad!";
    }
    this.Filtro3="";
  }

  async adminFriends(user2:string,tipo:Number){
    let aux= await this.agregarAmigoServicio.adminFriends(this.idUsuarioGlobal,user2,tipo);
    if(aux!='false'){
      alert("Accion realizada correctamente!");
      this.ngOnInit();
    }else{
      alert("Error al realizar esta acción!");
    }
  }
  borrarRegistros(){
    this.Amigos=[]
    this.Solicitudes=[]
    this.Sugerencias=[]
    this.Filtro1=""
    this.Filtro2=""
    this.Filtro3=""
  }
}
