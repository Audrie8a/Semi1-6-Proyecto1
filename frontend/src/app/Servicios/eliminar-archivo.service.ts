import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EliminarArchivoComponent } from '../Componentes/eliminar-archivo/eliminar-archivo.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class EliminarArchivoService {

  url:string="http://localhost:3000/";//"bL-475949248.us-east-2.elb.amazonaws.com:3000/"
  constructor(private httpClient: HttpClient) { }

  getMisArchivos(iduser:string | null){
    const ruta = this.url+"Inicio/getMisFiles";
    const data= {iduser};
    return this.httpClient.post(ruta,data).toPromise();
  }

  EliminarArchivo(iduser:string | null, filee: string){
    const ruta = this.url + "Inicio/Eliminar";
    const data = {iduser, filee};
    return this.httpClient.post(ruta, data).toPromise();
  }

  verificar(id:string | null, contraAct:string){
    const ruta = this.url+"Inicio/verifica";
    const data = {id, contraAct};
    return this.httpClient.post(ruta, data).toPromise();
  }

}
