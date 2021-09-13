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
  idUsuarioGlobal:string|null='';

  base64: string="Base64...";
  fileSelected?:Blob;
  imageUrl?:string;
    
  @ViewChild('fileInput',{static:false}) fileInput!: ElementRef;  
  constructor(private sant:DomSanitizer,
    public subirArchivoService:SubirArchivoService ,
    public _activatedRoute: ActivatedRoute,
    public _router: Router) { }

  ngOnInit(): void {
    let usuario=this._activatedRoute.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
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
    this.fileSelected= this.fileInput.nativeElement.files[0];
    const imageBlob=this.fileInput.nativeElement.files[0];
    this.imageUrl=this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string;
    
    
    
    this.convertFileToBase64();
    
    if (this.base64!="Base64..."){
      alert("Subiendo Imagen!");
      let arryaAux=this.base64.split(",",2)
      this.base64=arryaAux[1];
      if(this.fileSelected?.type=="application/pdf"){
        //Colocar metodo pdf
      }else if (this.fileSelected?.type=="text/plain"){
        //Colocar metodo texto
      }else{
        this.subirArchivoService.CargarImagen("Archivo",this.base64);
      }
      
    }
        
  }

  
  convertFileToBase64(){
    let reader= new FileReader();
    reader.readAsDataURL(this.fileSelected as Blob);
    reader.onloadend=()=>{
      this.base64=reader.result as string;
      
    }   
    
  }
}
