import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-eliminar-archivo',
  templateUrl: './eliminar-archivo.component.html',
  styleUrls: ['./eliminar-archivo.component.css']
})
export class EliminarArchivoComponent implements OnInit {
  idUsuarioGlobal:string | null="";
  constructor(public _routre:Router,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
  }

}
