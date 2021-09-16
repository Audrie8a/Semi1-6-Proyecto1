import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; 
import { SubirArchivoService } from 'src/app/Servicios/subir-archivo.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.css']
})
export class SubirArchivoComponent implements OnInit {
  Foto: string = ''; //nombre del archivo
  idUsuarioGlobal:string|null='';

  base64: string="Base64...";
  fileSelected?:Blob;
  imageUrl?:string;

  cont: number = 0;
  archivo: string = '';
  estado: string = ''; //1 es publico - 0 es privado
  contra: string = ''; 
  tipo: string = '';
    
  @ViewChild('fileInput',{static:false}) fileInput!: ElementRef;  
  constructor(private sant:DomSanitizer,
    public subirArchivoService:SubirArchivoService ,
    public _activatedRoute: ActivatedRoute,
    public _router: Router) { }

  ngOnInit(): void {
    this.base64 = "Base64...";
    this.archivo = '';
    this.estado = '';
    this.tipo = '';
    let usuario=this._activatedRoute.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
  }

  async Cargar(){
    let correct = await this.subirArchivoService.verificar(this.idUsuarioGlobal, this.contra);
    let json=JSON.stringify(correct)
    let obj= JSON.parse(json)
    if(correct == "false"){
      alert('esa no es tu contraseña >:(');//incertar, ya puedo verificar si la contra es correcta
    } else {
      //variables a mandar: archivo, base64, estado, idUsuarioGlobal, tipo
      this.onFileUpload();
      alert('todo bien');
      if(this.cont > 0){
        window.location.reload();
      }
      this.cont++;
    }
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
    //const imageBlob=this.fileInput.nativeElement.files[0];
    //this.imageUrl=this.sant.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileSelected)) as string;

    this.convertFileToBase64();
    
    if (this.base64!="Base64..."){
      alert("Subiendo Archivo!");
      let arryaAux=this.base64.split(",",2)
      this.base64=arryaAux[1];
      if(this.fileSelected?.type=="application/pdf"){
        //alert('es un PDF'+ this.base64);
        this.tipo = '.pdf'
      }else if (this.fileSelected?.type=="text/plain"){
        //alert('es un TXT'+ this.base64);
        this.tipo = '.txt'
      }else {
        //alert('es una IMAGEN JPG o PNG');
        this.tipo = '.jpg';
      }
      //alert(this.archivo+' antes de');
      this.subirArchivoService.CargarArchivo(this.archivo, this.base64, this.estado, this.idUsuarioGlobal, this.tipo);
      alert(this.archivo + '-' + this.base64 + '-' + this.estado + '-' + this.tipo + ' antes');
    }

  }

  
  convertFileToBase64(){
    
    let reader= new FileReader();
    reader.readAsDataURL(this.fileSelected as Blob);
    
    reader.onloadend=()=>{
      this.base64=reader.result as string;
      //console.log(this.base64+'/--*-*-*');
    }   
  }
}
