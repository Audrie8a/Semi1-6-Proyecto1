import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; 
import { SubirArchivoService } from 'src/app/Servicios/subir-archivo.service';

@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.css']
})
export class SubirArchivoComponent implements OnInit {
  Foto: string = '';


  base64: string="Base64...";
  fileSelected?:Blob;
  imageUrl?:string;
    
  @ViewChild('fileInput',{static:false}) fileInput!: ElementRef;  
  constructor(private sant:DomSanitizer,
    public subirArchivoService:SubirArchivoService ,
    public _activatedRoute: ActivatedRoute,
    public _router: Router) { }

  ngOnInit(): void {
  }

  Cargar(){
    this.onFileUpload();
  }

  onSelectNewFile():void{
    this.fileSelected=this.fileInput.nativeElement.files[0];
    if(this.fileSelected?.type=="application/pdf"){
      this.imageUrl='../../../assets/Img/PDF.png';
    }else if (this.fileSelected?.type=="text/plain"){
      this.imageUrl='../../../assets/Img/Texto.png'
    }else{
      this.imageUrl=this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string;
    }
    
  }

  onFileUpload(){
    alert("Subiendo Imagen!");
    this.fileSelected= this.fileInput.nativeElement.files[0];
    const imageBlob=this.fileInput.nativeElement.files[0];
    this.imageUrl=this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string;
    //alert(imageBlob);    
    const file = new FormData();
    file.set('file', imageBlob);
    //this.subirArchivoService.saveImagen(file);
  }
}
