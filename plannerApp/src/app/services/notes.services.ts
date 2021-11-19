import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscriber, Subscription, Observable } from 'rxjs';
import { Note } from 'src/app/models/note';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotesServices {
  private notes: Note[] = [];

  notesUpdated = new Subject<Note[]>();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public httpClient: HttpClient
  ) {}

  getNotes(): Observable<Note[]> {
    return this.httpClient
      .get<Note[]>('http://localhost:3000/api/notes')
      //Using pipe & map so I can have a local copy of the note array,without it Delete and Add elements don't show up initially without refresh
      .pipe(map((notes) => (this.notes = notes)));
  }

  addNote(note: Note) {
    this.httpClient
      .post<{ message: string; noteId: string }>(
        'http://localhost:3000/api/notes',
        note
      )
      .subscribe((responseData) => {
        const newNote: Note = {
          id: responseData.noteId,
          title: note.title,
          description: note.description,
          startDate: note.startDate,
          endDate: note.endDate,
          createdDate: note.createdDate,
        };
        console.log(newNote);
        this.notes.push(newNote);
        console.log(this.notes);
        this.notesUpdated.next([...this.notes]);
        this.router.navigate(['/notes']).then(() => window.location.reload());
      });
  }

  updateNote(note: Note): void {
    this.httpClient.put<{ message: string; noteId: string }>(
      'http://localhost:3000/api/notes',
      note
    ).subscribe((responseData) => {
      console.log(responseData);
    });
  }

  deleteNote(noteId: string) {
    this.httpClient
      .delete('http://localhost:3000/api/notes/' + noteId)
      .subscribe(() => {
        console.log(this.notes);
        const updatedNotes = this.notes.filter((note) => note.id !== noteId);
        console.log(updatedNotes);
        this.notes = updatedNotes;
        this.notesUpdated.next([...this.notes]);
        // this.router.navigate(['/notes']).then(() => window.location.reload())
      });
  }

  getNotesUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  getNote(id: string) {
    return this.httpClient.get<Note>('http://localhost:3000/api/notes/' + id);
    // console.log(`Note is ${id}`)
    // const returnNote = this.notes.find(note => note.id === id)
    // console.log(`getNote return an id of-${id}`)
  }
}
