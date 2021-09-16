import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'; 
import { EditarArchivoService } from 'src/app/Servicios/editar-archivo.service';

@Component({
  selector: 'app-editar-archivo',
  templateUrl: './editar-archivo.component.html',
  styleUrls: ['./editar-archivo.component.css']
})
export class EditarArchivoComponent implements OnInit {
  idUsuarioGlobal:string | null="";
  constructor(private sant:DomSanitizer,
    public EditarArchivoSevice: EditarArchivoService,
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
  estado: string = '';

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
    let aux= await this.EditarArchivoSevice.getMisArchivos(this.idUsuarioGlobal);
    let json = JSON.stringify(aux)
    let obj = JSON.parse(json)
    this.MisArchivos = obj;
  }

  borrar(idArch: any){
    //alert(idArch + "--" + ruta);
    this.fileId = idArch;
    this.verif = 1;
  }

  async delete(idArch: any){
    //alert(idArch + ' - ' + ruta + ' - ' + this.cont)
    let correct = await this.EditarArchivoSevice.verificar(this.idUsuarioGlobal, this.cont);
    let json=JSON.stringify(correct)
    let obj= JSON.parse(json)
    if(correct == "false"){
      alert('esa no es tu contraseña >:(');//incertar, ya puedo verificar si la contra es correcta
    } else {
      this.EditarArchivoSevice.editarEstado(idArch, this.estado);
      this.verif = 0;
      this.cont = '';
      this.fileId = '';
      this.fileRute = '';
    }
  }

}
