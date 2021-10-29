import { Preferences } from './preferences';
import { Byte } from '@angular/compiler/src/util';

export interface Profile {
    userId: number;
    avtaar: Byte[];

    firstName: string;
    lastName: string;
    address: string;
    state: string;
    zipcode: string;
    country: string;

    email: string;
    mobileCountryCode: string;
    mobileNumber: number;

    preferences: Preferences;
}