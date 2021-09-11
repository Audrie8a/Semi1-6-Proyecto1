import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  url:string="http://localhost:3000/";//"bL-475949248.us-east-2.elb.amazonaws.com:3000/"
  constructor(/*private httpClient: HttpClient*/) { }

  saveImagen(file: FormData){
    // const ruta=this.url+"Archivo/Upload";
    // return this.httpClient.post(ruta,file).subscribe(response =>{
    //   alert(response);
    // });
  }
}
