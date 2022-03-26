import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as _ from 'lodash';

import { NotesService } from './services';
import { ICONS } from './shared/constants';
import { INote } from './shared/interfaces';
import { UpdateNoteComponent } from './components/update-note/update-note.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('header', { static: false })
  headerInput: ElementRef<any>;

  @ViewChild('textarea', { static: false })
  textarea: ElementRef<any>;

  @HostListener('document:click', ['$event'])
  clickOutside(event) {
    if (
      this.textarea?.nativeElement.contains(event.target) ||
      this.headerInput?.nativeElement.contains(event.target)
    ) {
      this.showContent = true;
      return;
    }
    this.showContent = false;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event) {
    if (event.key === 'Enter' && this.noteForm.valid) {
      this.addNote();
    }
  }
  notes$: Observable<INote[]>;

  noteForm: FormGroup;

  showContent = false;

  icons = ICONS;
  constructor(
    private notesService: NotesService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.noteForm = this.formBuilder.group({
      header: [null],
      data: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.notes$ = this.notesService
      .getNotes()
      .pipe(map(notes => _.sortBy(notes, note => note.updatedAt)));
  }

  addNote() {
    const note = this.noteForm.value;
    if (this.noteForm.valid)
      this.notesService
        .addNote({ ...note, createdAt: +new Date(), updatedAt: +new Date() })
        .pipe(take(1))
        .subscribe(() => {
          this.noteForm.reset();
        });
  }

  editNote(note: INote) {
    const dialogRef = this.dialog.open(UpdateNoteComponent, {
      width: '600px',
      height: '350px'
    });
    dialogRef.componentInstance.updateNote.reset({ ...note });
    dialogRef.componentInstance.id = note.id;
  }

  onFocus() {
    this.showContent = true;
  }
}
