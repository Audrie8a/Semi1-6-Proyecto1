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

   //Login
   Usuario: string = '';
   Passwords: string = '';
 
   //Registro
   Usr: string = '';
   Nombre: string = '';
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

   }

    borrarRegistro(){
      this.Usuario='';
      this.Passwords='';
      this.Usr='';
      this.Nombre = '';
      this.Pass = '';
      this.Pass2='';
      this.Foto = '';
    }
}
