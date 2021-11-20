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
    return (
      this.httpClient
        .get<Note[]>('http://localhost:3000/api/notes')
        //Using pipe & map so I can have a local copy of the note array,without it Delete and Add elements don't show up initially without refresh
        //.pipe(map((notes) => (this.notes = notes)));
        .pipe(
          map((notes) =>
            notes.map((note) => {
              note.startDate = new Date(note.startDate);
              note.endDate = new Date(note.endDate);
              note.createdDate = new Date(note.createdDate);
              return note;
            })
          )
        )
    );
    // httpClient.get<Hero[]>(url).pipe(
    //   map(hero => hero.map(h => {
    //       h.dateOfBirth = new Date(h.dateOfBirth);
    //       return h;
    //   })))
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
        //this.router.navigate(['/notes']).then(() => window.location.reload());
      });
  }

  updateNote(note: Note): void {
    const id = note.id;
    console.log(note)
    console.log(id);
    this.httpClient
      .put<{ message: string; noteId: string }>(
        'http://localhost:3000/api/notes/'+id,
        note
      )
      .subscribe((responseData) => {
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
    return this.httpClient
      .get<Note>('http://localhost:3000/api/notes/' + id)
      .pipe(
        map((oneNote) => {
          oneNote.startDate = new Date(oneNote.startDate);
          oneNote.endDate = new Date(oneNote.endDate);
          oneNote.createdDate = new Date(oneNote.createdDate);
          return oneNote;
        })
      );

    // console.log(`Note is ${id}`)
    // const returnNote = this.notes.find(note => note.id === id)
    // console.log(`getNote return an id of-${id}`)
  }
}
