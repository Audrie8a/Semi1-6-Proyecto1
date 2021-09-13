import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url:string="http://localhost:3000/";//"bL-475949248.us-east-2.elb.amazonaws.com:3000/"
  constructor(private httpClient: HttpClient) { }

  Ingresar(Usuario:string, Password:string ){
    const ruta= this.url+"Inicio/login";
    const data ={Usuario,Password};
    return this.httpClient.post(ruta,data).toPromise();

  }
  Registrar(Nombre:string,Usuario:string,Correo:string,Password:string,idFoto:string ){
    const ruta= this.url+"Inicio/registro";
    const data ={Nombre,Usuario,Correo,Password,idFoto};
    return this.httpClient.post(ruta,data).toPromise();

  }
}
