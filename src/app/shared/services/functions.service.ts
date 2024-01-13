import { Injectable } from '@angular/core';
export const _macRegex = "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$";

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

constructor() { }
  macAddressConstructor(value: any ) {
  // if (!value) return ;
  const val = (value.toUpperCase()
        .replace(/[^\d|A-F]/g, '')
        .match(/.{1,2}/g) || [])
        .join(":")

    return val;
  }
}
