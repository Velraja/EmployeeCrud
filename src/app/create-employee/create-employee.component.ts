import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms'
import { customvalidators } from '../../shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service'
import { IEmployee } from '../iemployee';
import { ISkill } from '../iskill';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  empid = null;

  validationMessages = {
    'employeename':
    {
      'required': 'Employee name required',
      'minlength': 'Employee name must be greater than 2 characters',
      'maxlength': 'Employee name must be less than 10 characters'
    },
    'email':
    {
      'required': 'Email required',
      'emailDomain': 'Email domail should be abc.com'
    },
    'Emailgp':
    {
      'Emailmismatchs': 'Email and confirm email not same'
    },
    'confirmemail':
    {
      'required': 'ConfirmEmail required'
    }
    ,
    'phone':
    {
      'required': 'Phone required'
    }
  }
  formErrors = {
    'employeename': '',
    'email': '',
    'confirmemail': '',
    'Emailgp': '',
    'phone': ''
  }
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private empservice: EmployeeService, private _router: Router) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      employeename: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      Emailgp: this.fb.group(
        {
          email: ['', [Validators.required, customvalidators.emailDomain('abc.com')]],
          confirmemail: ['', Validators.required]
        }, { validators: Emailmismatchs }
      ),
      preference: ['email'],
      phone: [''],
      Skills: this.fb.array([
        this.addSkillFormGroup()
      ]
      )
    })
    this.employeeForm.valueChanges.subscribe(
      (value: string) => {
        this.logValidationError(this.employeeForm);
      }
    )
    this.route.paramMap.subscribe(params1 => {
      const EmpId = +params1.get('id');
      this.empid = EmpId;
      if (EmpId) {
        this.getEmployee(EmpId);
      }
      else {
        this.employee = {
          id: null,
          employeename: "",
          preference: "",
          email: "",
          confirmemail: "",
          phone: null,
          Skills: []
        }
      }
    }
    );
  }
  getEmployee(id: number) {
    this.empservice.getEmployeeById(id).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (err: any) => console.log(err)
    );
    console.log(this.employeeForm.valid);
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue(
      {
        employeename: employee.employeename,
        Emailgp:
        {
          email: employee.email,
          confirmemail: employee.confirmemail
        },
        preference: employee.preference,
        phone: employee.phone
      }
    );
    this.employeeForm.setControl("Skills", this.setExistingSkills(employee.Skills));
  }
  setExistingSkills(skillset: ISkill[]): FormArray {
    const formarray = new FormArray([]);
    skillset.forEach(
      s => {
        formarray.push(
          this.fb.group(
            {
              Skillname: s.Skillname,
              Experience: s.Experience,
              Proficiency: s.Proficiency
            }
          )
        )
      }
    );
    return formarray;
  }
  RemoveSkillset(skillid: number): void {
    const skillsFromArray = (<FormArray>this.employeeForm.get("Skills"));
    skillsFromArray.removeAt(skillid);
    skillsFromArray.markAsDirty();
    skillsFromArray.markAsTouched();
  }
  addSkillFormGroup(): FormGroup {
    return this.fb.group(
      {
        Skillname: ['', Validators.required],
        Experience: ['', Validators.required],
        Proficiency: ['', Validators.required]
      }
    );
  }
  addSkillButtonClick() {
    (<FormArray>this.employeeForm.get("Skills")).push(this.addSkillFormGroup());
  }

  onContactPreferencechange(selectedValue: string): void {
    const phoneControl = this.employeeForm.get("phone");
    if (selectedValue == "phone") {
      phoneControl.setValidators(Validators.required)
    }
    else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
  logValidationError(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractcontrol = group.get(key);
      this.formErrors[key] = '';
      if (abstractcontrol && !abstractcontrol.valid && (abstractcontrol.touched || abstractcontrol.dirty || abstractcontrol.value !== "")) {
        const messages = this.validationMessages[key];
        for (const errorkey in abstractcontrol.errors) {
          if (errorkey) {
            this.formErrors[key] += messages[errorkey] + ' ';
          }
        }
      }
      if (abstractcontrol instanceof FormGroup) {
        this.logValidationError(abstractcontrol);
      }
    })
  }

  onSubmit(): void {
    if (this.empid != null && this.empid != 0) {
      this.mapFormValuestoEmployeeModel();
      this.empservice.updateEmployee(this.employee).subscribe(
        () => this._router.navigate(['List']),
        (err: any) => console.log(err)
      )
    }
    else {
      this.employee.employeename = this.employeeForm.get("employeename").value;
      this.employee.email = this.employeeForm.get("Emailgp").value.email;
      this.employee.preference = this.employeeForm.get("preference").value;
      this.employee.confirmemail = this.employeeForm.get("Emailgp").value.confirmemail;
      this.employee.phone = this.employeeForm.value.phone;
      this.employee.Skills = this.employeeForm.value.Skills;
      this.empservice.addEmployee(this.employee).subscribe(
        () => this._router.navigate(['List']),
        (err: any) => console.log(err)
      )
    }
  }
  mapFormValuestoEmployeeModel() {
    this.employee.id = this.empid;
    this.employee.employeename = this.employeeForm.value.employeename;
    this.employee.preference = this.employeeForm.get("preference").value;
    this.employee.email = this.employeeForm.get("Emailgp").value.email;
    this.employee.confirmemail = this.employeeForm.get("Emailgp").value.confirmemail;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.Skills = this.employeeForm.value.Skills;
  }
  LoadData(): void {
    //this.logValidationError(this.employeeForm);
    //console.log(this.formErrors);
  }

}

function Emailmismatchs(group: AbstractControl): { [key: string]: any } | null {
  const email = group.get("email");
  const confirmemail = group.get("confirmemail");
  if (email.value === confirmemail.value || confirmemail.pristine && confirmemail.value == "") {
    return null;
  }
  else {
    return { 'Emailmismatchs': true }
  }
}