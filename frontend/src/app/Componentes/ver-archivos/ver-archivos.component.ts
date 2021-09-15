import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerArchivosService } from 'src/app/Servicios/ver-archivos.service';
import { DomSanitizer } from '@angular/platform-browser'; 

@Component({
  selector: 'app-ver-archivos',
  templateUrl: './ver-archivos.component.html',
  styleUrls: ['./ver-archivos.component.css']
})
export class VerArchivosComponent implements OnInit {
  idUsuarioGlobal:string | null="";
  constructor(private sant:DomSanitizer,
    public verArchivosSevice: VerArchivosService,
    public _routre:Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
    this.losArchivos();
  }

  Archivos: any;
  Archivo: any;
  async losArchivos(){
    let aux= await this.verArchivosSevice.getArchivos(this.idUsuarioGlobal);
    let json=JSON.stringify(aux)
    let obj= JSON.parse(json)
    this.Archivos = obj;
  }

}
