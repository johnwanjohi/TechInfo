import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  // constructor() { }
  getCounter(tick) {
    return timer(0, tick);
  }
}
