import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeesComponent } from './list-employees/list-employees.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';



const routes: Routes = [

  { path: 'List', component: ListEmployeesComponent },
  { path: 'Create', component: CreateEmployeeComponent },
  { path: 'Edit/:id', component: CreateEmployeeComponent },
  { path: '', redirectTo: '/List', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
