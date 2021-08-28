import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/Servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
   Foto: string = '';

   linkRouter: string ='';

   async Login() {
     this.linkRouter='/User';
     this._router.navigate([this.linkRouter,this.Usr]);
   }

   async Registrar(){}

}
