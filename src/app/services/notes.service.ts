import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';

import { from, Observable } from 'rxjs';

import { INote } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private firestore: Firestore) {}

  getNotes(): Observable<INote[]> {
    const notesRef = collection(this.firestore, 'notes');

    return collectionData(notesRef, {
      idField: 'id'
    }) as Observable<INote[]>;
  }

  addNote(note: Partial<INote>): Observable<INote> {
    const notesRef = collection(this.firestore, 'notes');

    return from(
      (addDoc(notesRef, note) as unknown) as Promise<INote>
    ) as Observable<INote>;
  }

  updateNote(noteId: string, note: Partial<INote>): Observable<INote> {
    const notesRef = doc(this.firestore, `notes/${noteId}`);
    return from(
      (setDoc(notesRef, note) as unknown) as Promise<INote>
    ) as Observable<INote>;
  }

  deleteNote(noteId: string): Observable<INote> {
    const notesRef = doc(this.firestore, `notes/${noteId}`);
    return from(
      (deleteDoc(notesRef) as unknown) as Promise<INote>
    ) as Observable<INote>;
  }
}
