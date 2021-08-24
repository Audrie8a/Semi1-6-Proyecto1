import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

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


   async Login() {}

   async Registrar(){}

}
