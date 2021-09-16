import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'; 
import { EliminarArchivoService } from 'src/app/Servicios/eliminar-archivo.service'; 

@Component({
  selector: 'app-eliminar-archivo',
  templateUrl: './eliminar-archivo.component.html',
  styleUrls: ['./eliminar-archivo.component.css']
})
export class EliminarArchivoComponent implements OnInit {
  idUsuarioGlobal:string | null="";
  constructor(private sant:DomSanitizer,
    public EliminarArchivosSevice: EliminarArchivoService,
    public _routre:Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
    this.MyArchivos();
  }

  verif: number = 0;
  cont: string = '';

  cancelar(){
    this.verif = 0;
    this.cont = '';
    this.fileId = '';
    this.fileRute = '';
  }

  fileId: string = '';
  fileRute: string = '';

  MisArchivos: any;
  MiArchivo: any;
  async MyArchivos(){
    let aux= await this.EliminarArchivosSevice.getMisArchivos(this.idUsuarioGlobal);
    let json = JSON.stringify(aux)
    let obj = JSON.parse(json)
    this.MisArchivos = obj;
  }

  borrar(idArch: any, ruta: any){
    //alert(idArch + "--" + ruta);
    this.fileId = idArch;
    this.fileRute = ruta;
    this.verif = 1;
  }

  async delete(idArch: any, ruta: any){
    //alert(idArch + ' - ' + ruta + ' - ' + this.cont)
    let correct = await this.EliminarArchivosSevice.verificar(this.idUsuarioGlobal, this.cont);
    let json=JSON.stringify(correct)
    let obj= JSON.parse(json)
    if(correct == "false"){
      alert('esa no es tu contraseña >:(');//incertar, ya puedo verificar si la contra es correcta
    } else {
      let arryaAux=ruta.split("https://appweb-6p1.s3.us-east-2.amazonaws.com/",2)
      ruta=arryaAux[1];
      
      this.EliminarArchivosSevice.EliminarArchivo(idArch, ruta);
      alert("Eliminado correctamente!");
      this.verif = 0;
      this.cont = '';
      this.fileId = '';
      this.fileRute = '';
    }
  }

}
