import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  url:string="http://localhost:3000/";//"bL-475949248.us-east-2.elb.amazonaws.com:3000/"
  constructor(private httpClient: HttpClient) { }

  

  CargarImagen( id:string, foto: string ){
    const ruta = this.url+"subirfoto";
    const data= {id,foto};
    return this.httpClient.post(ruta,data).toPromise();

  }
}
