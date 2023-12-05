import { PrefixNot } from '@angular/compiler';
import { Injectable } from '@angular/core';
const PREFIX = "fleeca-";

@Injectable({
  providedIn: 'root'
})


export class LocalstorageService {


  save(jwt: string){
    localStorage.setItem(PREFIX + "jwt", jwt);
  }

  load(): string{
    return <string> localStorage.getItem(PREFIX + "jwt");
  }

  delete(): void {
    localStorage.removeItem(PREFIX + "jwt");
  }

  constructor() { }
}
