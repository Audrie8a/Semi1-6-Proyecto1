import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  constructor(private http: HttpClient) { }
  API_URI = 'http://localhost:3000';

  public setArchivo(request: SubirArchivoComponent){
    return this.http.post(`${this.API_URI}/nuevoArchivo`, request, httpOptions);
  }
}
