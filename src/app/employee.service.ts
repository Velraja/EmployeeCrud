import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IEmployee } from './iemployee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpclient: HttpClient) { }
  baseUrl = 'http://localhost:3000/employees/';
  httpOptions = { headers: new  HttpHeaders({ 'Content-Type': 'application/json' }) };
  getEmployees(): Observable<IEmployee[]> {
    return this.httpclient.get<IEmployee[]>(this.baseUrl).pipe(catchError(this.errorHandler));
  }
  addEmployee(employee: IEmployee): Observable<IEmployee> {
    try {
      return this.httpclient.post<IEmployee>(this.baseUrl, employee, this.httpOptions).pipe(catchError(this.errorHandler));
    }
    catch (error) {
      return null;
    }

  }
  getEmployeeById(employeeId: number): Observable<IEmployee> {
    return this.httpclient.get<IEmployee>(this.baseUrl + employeeId).pipe(catchError(this.errorHandler));
  }


  updateEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.httpclient.put<IEmployee>(this.baseUrl + employee.id, employee, this.httpOptions).pipe(catchError(this.errorHandler));
  }

  deleteEmployeeById(employeeid: number): Observable<number> {
    return this.httpclient.delete<number>(this.baseUrl + employeeid, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(error.message || "CLient error.");
    }
    else {
      return throwError(error.message || "server error.");
    }
  }
}
