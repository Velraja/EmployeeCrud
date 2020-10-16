import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../iemployee';
import { EmployeeService } from '../employee.service'
  import { Router } from '@angular/router'

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];
  constructor(private _employeeService: EmployeeService, private _router: Router) { }

  ngOnInit(): void {
   this.LoadEmployees();
  }
  LoadEmployees():void
  {
    this._employeeService.getEmployees().subscribe(
      (data) => this.employees = data,
      (err) => console.log(err)
    )
  }
  EditEmployee(employeeID: number): void {
    this._router.navigate(["Edit", employeeID]);
  }
  DeleteEmployee(id: number): void {
    if (confirm("Are you sure to delete this record?")) {
      this._employeeService.deleteEmployeeById(id).subscribe(
        (data) => {
          this.LoadEmployees();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
