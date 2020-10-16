import { TestBed } from '@angular/core/testing';

import { Employee.ServiceService } from './employee.service.service';

describe('Employee.ServiceService', () => {
  let service: Employee.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Employee.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
