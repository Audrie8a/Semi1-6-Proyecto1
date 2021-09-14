import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgregarAmigoService {

  url:string="http://localhost:3000/";//"bL-475949248.us-east-2.elb.amazonaws.com:3000/"
  constructor(private httpClient: HttpClient) { }

  getSugerencias (idUser:string | null,Usuario:string,tipo:Number){
    const ruta = this.url+"Inicio/Sugerencias";
    const data = {idUser,Usuario,tipo};
    return this.httpClient.post(ruta,data).toPromise();
  }
  getAmigos (idUser:string | null,Usuario:string,tipo:Number){
    const ruta = this.url+"Inicio/Amigos";
    const data = {idUser,Usuario,tipo};
    return this.httpClient.post(ruta,data).toPromise();
  }
  getSolicitudes (idUser:string | null,Usuario:string,tipo:Number){
    const ruta = this.url+"Inicio/Solicitudes";
    const data = {idUser,Usuario,tipo};
    return this.httpClient.post(ruta,data).toPromise();
  }

  adminFriends (user1:string | null,user2:string,tipo:Number){
    const ruta = this.url+"Inicio/adminFriends";
    const data = {user1,user2,tipo};
    return this.httpClient.post(ruta,data).toPromise();
  }

}
