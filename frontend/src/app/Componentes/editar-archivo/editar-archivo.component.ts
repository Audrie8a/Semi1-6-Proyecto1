import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-archivo',
  templateUrl: './editar-archivo.component.html',
  styleUrls: ['./editar-archivo.component.css']
})
export class EditarArchivoComponent implements OnInit {
  idUsuarioGlobal:string | null="";
  constructor(public _routre:Router,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.idUsuarioGlobal=usuario;
  }

}
