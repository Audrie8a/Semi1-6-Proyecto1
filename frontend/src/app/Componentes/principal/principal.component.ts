import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrincipalService } from 'src/app/Servicios/principal.service';
import { DomSanitizer } from '@angular/platform-browser'; 

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  dataUser={
    idUser: Number,
    nombre: String,
    usuario: String,
    correo: String,
    contra: String,
    foto: String
  }


  Usuario:string | null="";
  ImgUrl: string="../../../assets/Img/descarga.png"
  fileSelected?:Blob;

  constructor(private sant:DomSanitizer,
    public princialSevice: PrincipalService,
    public _routre:Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.Usuario=usuario;
    this.cargarDatos();
    
  }

  tiles: Tile[] = [
    
    {text: 'Bienvenido', cols: 3, rows: 1, color: 'black'},
  ];

  async cargarDatos(){
    let aux= await this.princialSevice.CargarDatosUser(this.Usuario);
    let json=JSON.stringify(aux)
    let obj= JSON.parse(json)
    this.fileSelected=this.dataURItoBlob(obj.foto)
    this.ImgUrl=this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string;
    
    
  }
  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

}
