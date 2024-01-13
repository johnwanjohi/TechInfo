import { SitenotesComponent } from '../sitenotes.component';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AccountsService } from 'app/shared/services/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-sitenote',
  templateUrl: './delete-sitenote.component.html',
  styleUrls: ['./delete-sitenote.component.scss']
})

export class DeleteSitenoteComponent implements OnInit {
  id: any;
  note: any;

  constructor(public dialog: MatDialog,
    private AC: AccountsService,
    public dialogRef: MatDialogRef<SitenotesComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
  }

  ngOnInit(): void {
    this.id = this.data.id;
    const params = {
      action: 'getSiteNoteById',
      module: 'site_notes',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      console.dir(answer.site_notes.note)
      this.note = answer.site_notes.note;
    });
  }

  Submit() {
    const params = {
     // action: 'delete',
      // module: 'site_notes',
      id: this.id,
    };
    const endpoint= 'site_notes/delete';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.AC.setDeletedSiteNote(this.id);
      this.closeDialog();
    });
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
