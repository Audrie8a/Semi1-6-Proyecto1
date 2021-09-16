import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VerArchivosComponent } from '../Componentes/ver-archivos/ver-archivos.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class VerArchivosService {

  url:string="http://localhost:3000/";//"bL-475949248.us-east-2.elb.amazonaws.com:3000/"
  constructor(private httpClient: HttpClient) { }

  getArchivos(iduser:string | null){
    const ruta = this.url+"Inicio/getFiles";
    const data= {iduser};
    return this.httpClient.post(ruta,data).toPromise();
  }

}
