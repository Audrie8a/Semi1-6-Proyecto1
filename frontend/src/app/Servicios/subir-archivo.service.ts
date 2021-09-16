import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubirArchivoComponent } from '../Componentes/subir-archivo/subir-archivo.component';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
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

  CargarArchivo(archivo:string, base64:string, estado:string, iduser:string | null, tipo:string){
    const ruta = this.url+"Inicio/subirFile";
    const data = {archivo, base64, estado, iduser, tipo}
    //console.log(data.base64);
    return this.httpClient.post(ruta, data).toPromise();
  }

  verificar(id:string | null, contraAct:string){
    const ruta = this.url+"Inicio/verifica";
    const data = {id, contraAct};
    return this.httpClient.post(ruta, data).toPromise();
  }
}
