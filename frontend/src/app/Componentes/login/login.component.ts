import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/Servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('fileInput',{static:false}) fileInput!: ElementRef;
  constructor(public loginService:LoginService,
              public _activatedRoute: ActivatedRoute,
              public _router: Router) { }

  ngOnInit(): void {
  }

 

  base64: string="Base64...";
  fileSelected?:Blob;

   //Login
   Usuario: string = '';
   Passwords: string = '';
 
   //Registro
   Usr: string = '';
   Nombre: string = '';
   Correo: string ='';
   Pass: string = '';
   Pass2: string = '';
   Foto: string = '';

   linkRouter: string ='';

   async Login() {
     let respuesta = await this.loginService.Ingresar(this.Usuario, this.Passwords);
     if(respuesta==='false'){
      this.linkRouter='/Home'
      alert("Error al ingresar, favor revise sus datos!")
     }else if (respuesta=='error'){
      this.linkRouter='/Home'
      alert("Se produjo un error al ingresar!")
     }else{
      this.borrarRegistro();
      alert("Bienvenido "+respuesta)
      this.linkRouter='/User';
      this._router.navigate([this.linkRouter,respuesta]);
     }
     
   }

   async Registrar(){
     this.onFileUpload();
     if (this.base64!="Base64..."){
      if (this.Pass==this.Pass2){
        let respuesta = await this.loginService.Registrar(this.Usr,this.Nombre,this.Correo,this.Pass,this.base64);
        if(respuesta!='error'){
          alert("Se ha registrado correctamente el usuario!");          
          this.borrarRegistro();
        }else{
          alert("Error al registrar usuario!")
        }
      }else{
          alert("Error, las contraseñas no coinciden!");
      }
     }
     
    
  }

  onFileUpload(){    
    this.fileSelected= this.fileInput.nativeElement.files[0];    
    
    
    this.convertFileToBase64();
    
    if (this.base64!="Base64..."){
      alert("Subiendo Imagen!");
      let arryaAux=this.base64.split(",",2)
      this.base64=arryaAux[1];      
    }
        
  }

  convertFileToBase64(){
    let reader= new FileReader();
    reader.readAsDataURL(this.fileSelected as Blob);
    reader.onloadend=()=>{
      this.base64=reader.result as string;
      
    }   
    
  }
    borrarRegistro(){
      this.Usuario='';
      this.Passwords='';
      this.Usr='';
      this.Correo='';
      this.Nombre = '';
      this.Pass = '';
      this.Pass2='';
      this.Foto = '';
    }
}
