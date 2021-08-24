import { TestBed } from '@angular/core/testing';

import { EditarArchivoService } from './editar-archivo.service';

describe('EditarArchivoService', () => {
  let service: EditarArchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditarArchivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
