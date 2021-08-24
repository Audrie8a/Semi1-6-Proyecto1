import { TestBed } from '@angular/core/testing';

import { AgregarAmigoService } from './agregar-amigo.service';

describe('AgregarAmigoService', () => {
  let service: AgregarAmigoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgregarAmigoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
