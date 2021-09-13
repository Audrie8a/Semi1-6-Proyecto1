import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  Usuario:string | null="";
  constructor(
    public _routre:Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let usuario=this.route.snapshot.paramMap.get("id");
    this.Usuario=usuario;
  }

  tiles: Tile[] = [
    
    {text: 'Bienvenido', cols: 3, rows: 1, color: 'black'},
  ];
}
