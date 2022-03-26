import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  addDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { INote } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private firestore: Firestore) {}

  getNotes(): Observable<INote[]> {
    return collectionData(collection(this.firestore, 'notes')) as Observable<
      INote[]
    >;
  }
}
