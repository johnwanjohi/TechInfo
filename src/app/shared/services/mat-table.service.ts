import { Injectable } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { User } from '../app-state/entity/user.entity';


@Injectable({
  providedIn: 'root',
})

export class MatTableService {

  constructor() {
  }

  hideShowColumns(user: User, displayedColumns: MtxGridColumn[]) {
    if (user?.role === 'User') {
      displayedColumns.forEach( (cell, index) => {
        console.dir(cell.header);
        return index === 0 ? cell.hide = true : cell.hide = false;
      })
    }
    return displayedColumns;
  }
}
