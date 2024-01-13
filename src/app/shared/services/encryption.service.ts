import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  
  constructor() { }

  convert2() {
    const CryptoJSAesJson = {
        stringify: function (cipherParams) {
            const vbJsonString = {
              ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };
            if (cipherParams.iv) {
              vbJsonString['iv'] = cipherParams.iv.toString()
            };
            if (cipherParams.salt) {
              vbJsonString['s'] = cipherParams.salt.toString()
            };
            return JSON.stringify(vbJsonString);
        },
        parse: function (jsonStr) {
            const vbJsonParse = JSON.parse(jsonStr);
            const cipherParams = CryptoJS.lib.CipherParams.create({
              ciphertext: CryptoJS.enc.Base64.parse(vbJsonParse.ct)
            });
            if (vbJsonParse.iv) {
              cipherParams['iv'] = CryptoJS.enc.Hex.parse(vbJsonParse.iv)
            }
            if (vbJsonParse['s']) {
              cipherParams.salt = CryptoJS.enc.Hex.parse(vbJsonParse.s)
            }
            return cipherParams;
        }    
      }
     return CryptoJSAesJson;
  }

  getPassword(): string {
    return environment.secretKey;
  }

  set(value){
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value),this.getPassword(), { format: this.convert2() }).toString();
    return encrypted;
  }

  get(value){
    const decrypted = JSON.parse(CryptoJS.AES.decrypt(value, this.getPassword(), {format: this.convert2() }).toString(CryptoJS.enc.Utf8));
    return decrypted;
  }


}
