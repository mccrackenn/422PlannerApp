import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscriber, Subscription, Observable } from 'rxjs';
import { Note } from 'src/app/models/note';


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
  ) { }

  getNotes()
  {
    // Using the spread opertor to return a copy of the array, not the original array
    this.httpClient.get<Note[]>('http://localhost:3000/api/notes')
      .subscribe(
        responseData =>
        {
          console.log(responseData);
          this.notes = responseData;
          this.notesUpdated.next([...this.notes]);
        });
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
        this.notesUpdated.next([...this.notes]);
        // this.router.navigate(['/notes']).then(() => window.location.reload())
      });
  }

  deleteNote(noteId: string) {
    this.httpClient
      .delete('http://localhost:3000/api/notes/' + noteId)
      .subscribe(() => {
        const updatedNotes = this.notes.filter((note) => note.id !== noteId);
        console.log(updatedNotes);
        this.notes = updatedNotes;
        this.notesUpdated.next([...this.notes]);
        // this.router.navigate(['/notes']).then(() => window.location.reload())
      });
  }

  getHeroesUpdateListener()
  {
    return this.notesUpdated.asObservable();
  }

  
  getNote(id: string) {
    return this.httpClient.get<Note>('http://localhost:3000/api/notes/' + id);
    // console.log(`Note is ${id}`)
    // const returnNote = this.notes.find(note => note.id === id)
    // console.log(`getNote return an id of-${id}`)
  }
}
