import { TestBed } from '@angular/core/testing';

import { EliminarArchivoService } from './eliminar-archivo.service';

describe('EliminarArchivoService', () => {
  let service: EliminarArchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EliminarArchivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
