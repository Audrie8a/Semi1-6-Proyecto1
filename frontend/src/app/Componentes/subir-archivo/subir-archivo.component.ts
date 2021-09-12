import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/Servicios/subir-archivo.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.css']
})
export class SubirArchivoComponent implements OnInit {

  constructor(private ArchivoService: SubirArchivoService, private http:HttpClient, public ruta: Router) { }

  public subir: any = {
    nombre: "",
    archivo: "",
    estado: "" ,
    dueño: ""
  }
  public id: string = "1";//este es un ejemplo de id, pero hay que jalar el id del usuario con el que se ingreso
  ngOnInit(): void {
    console.log('hollllllaaaaaaa');
  }

  probar(){
    this.subir.dueño = "1";
    this.subir.archivo = "probando";
    this.ArchivoService.setArchivo(this.subir).subscribe(
        res => {
          console.log(res);
          alert('Felicidades');
        },
        error => console.error(error)
      );
    console.log(this.subir.estado+"-------"+this.subir.nombre);
  }

}
