import { ISkill } from './ISkill';

export interface IEmployee {
    id?: number,
    employeename?: string,
    preference?: string,
    email?: string,
    confirmemail?: string,
    phone?: string,
    Skills?: ISkill[];
}
