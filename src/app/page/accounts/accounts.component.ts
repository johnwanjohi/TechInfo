import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AccountsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
