import { AbstractControl } from '@angular/forms'
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { from } from 'rxjs';
export class customvalidators {
    static emailDomain(Domainname: string) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const email: string = control.value;
            const domain = email.substring(email.lastIndexOf('@') + 1);
            if (email == '' || domain.toLocaleLowerCase() === Domainname.toLocaleLowerCase()) {
                return null;
            }
            else {
                return { 'emailDomain': true }
            }
        };
    }
}
