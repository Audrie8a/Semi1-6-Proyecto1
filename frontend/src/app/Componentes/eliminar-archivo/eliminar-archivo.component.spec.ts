import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarArchivoComponent } from './eliminar-archivo.component';

describe('EliminarArchivoComponent', () => {
  let component: EliminarArchivoComponent;
  let fixture: ComponentFixture<EliminarArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarArchivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
