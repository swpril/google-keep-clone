import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { NotesService } from 'src/app/services';
import { ICONS } from 'src/app/shared/constants';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.scss']
})
export class UpdateNoteComponent {
  icons = ICONS;
  updateNote: FormGroup;

  id: string;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NotesService,
    private dialogRef: MatDialogRef<UpdateNoteComponent>
  ) {
    this.updateNote = this.formBuilder.group({
      header: [null],
      data: [null, Validators.required]
    });
  }

  deleteNote() {
    this.noteService
      .deleteNote(this.id)
      .pipe(take(1))
      .subscribe(() => this.dialogRef.close());
  }

  saveNote() {
    this.noteService
      .updateNote(this.id, {
        ...this.updateNote.value,
        updatedAt: new Date()
      })
      .pipe(take(1))
      .subscribe(() => this.dialogRef.close());
  }
}
