import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerArchivosComponent } from './ver-archivos.component';

describe('VerArchivosComponent', () => {
  let component: VerArchivosComponent;
  let fixture: ComponentFixture<VerArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerArchivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
