import { TestBed } from '@angular/core/testing';

import { VerArchivosService } from './ver-archivos.service';

describe('VerArchivosService', () => {
  let service: VerArchivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerArchivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
