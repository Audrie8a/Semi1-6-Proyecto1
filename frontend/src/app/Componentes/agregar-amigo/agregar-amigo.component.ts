import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-agregar-amigo',
  templateUrl: './agregar-amigo.component.html',
  styleUrls: ['./agregar-amigo.component.css']
})
export class AgregarAmigoComponent implements OnInit {
  idUsuarioGlobal:string | null="";
  constructor(public _routre:Router,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
  }

  

}
