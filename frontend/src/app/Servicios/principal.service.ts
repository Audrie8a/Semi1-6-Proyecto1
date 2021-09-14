import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  url:string="http://localhost:3000/";//"bL-475949248.us-east-2.elb.amazonaws.com:3000/"
  constructor(private httpClient: HttpClient) { }

  CargarDatosUser(idUser:string|null){
    const ruta=this.url+"Inicio/getUser"   
    const data={idUser}
    return this.httpClient.post(ruta,data).toPromise();
  }
}
