import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscriber, Subscription, Observable, of } from 'rxjs';
import { Note } from 'src/app/models/note';
import { map, tap } from 'rxjs/operators';
import { SnackbarService } from './snackbar/snackbar.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotesServices {
  private notes: Note[] = [];
  private userNotes: Note[] = [];

  private localNotesUrl = 'http://localhost:3000/api/notes/';

  private azureUrl = 'https://mimicnodeserver.azurewebsites.net/api/notes/';
  private notesUrl = this.azureUrl;

  notesUpdated = new Subject<Note[]>();
  noteAdded = new Subject<Note>();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public snackBar: SnackbarService,
    public authService: AuthService
  ) {}

  // getNotes(): Observable<Note[]> {
  //   return (
  //     this.httpClient
  //       .get<Note[]>(this.localNotesUrl)
  //       //.get<Note[]>(this.notesUrl)
  //       // Using pipe & map so I can have a local copy of the note array,without it Delete and Add elements don't show up initially without refresh
  //       // .pipe(map((notes) => (this.notes = notes)));
  //       .pipe(
  //         map((notes) =>
  //           notes.map((note) => {
  //             note.startDate = new Date(note.startDate);
  //             note.endDate = new Date(note.endDate);
  //             note.createdDate = new Date(note.createdDate);
  //             return note;
  //           })
  //         ),
  //         tap((a) => (this.notes = a))
  //       )
  //   );

  // }

  getNotes(): Observable<Note[]> {
    const newUser = this.authService.getUserValue();  // .getCurrentUser();
    if (!newUser) {
      return of(this.userNotes);
    }
    console.log(newUser._id);
    return (
      this.httpClient
        .post<Note[]>(this.notesUrl + newUser._id, newUser)
        .pipe(
          map(
            (
              notes // Mapping operation was needed to convert dates back to date objects
            ) =>
              notes.map((note) => {
                note.startDate = new Date(note.startDate);
                note.endDate = new Date(note.endDate);
                note.createdDate = new Date(note.createdDate);
                return note;
              })
          ),
          tap((a) => (this.userNotes = a))
        )
    );
  }

  addNote(note: Note): void {
    const currentUser = this.authService.getUserValue();
    if (!currentUser) {
      console.log('Failed to add Note....');
      return;
    }
    const _id = currentUser._id;
    this.httpClient
      .post<{ message: string; noteId: string }>(
       this.notesUrl,
        {
          note,
          _id,
        }
      )
      .subscribe((responseData) => {
        // console.log(responseData)
        const newNote: Note = {
          id: responseData.noteId,
          title: note.title,
          description: note.description,
          startDate: note.startDate,
          endDate: note.endDate,
          createdDate: note.createdDate,
        };
        // console.log(newNote);
        this.userNotes.push(newNote);
        // console.log(this.notes);
        console.log('Note \"' + newNote.title + '\" successfully added. ');
        this.notesUpdated.next([...this.userNotes]);
        this.noteAdded.next(newNote);
        // this.router.navigate(['/notes']).then(()=>console.log('hello'));
        // this.snackBar.openSnackBar("message","action")
      });
  }

  updateNote(note: Note): void {
    const id = note.id;
    // console.log(note);
    // console.log(id);
    this.httpClient
      .put<{ message: string; noteId: string }>(this.notesUrl + id, note)
      .subscribe((responseData) => {
        console.log('UPDATED Note successfully. ' + responseData);
      });
  }

  deleteNote(noteId: string): void {
    this.httpClient
      .delete(this.notesUrl + noteId)
      .subscribe((response) => {
        console.log(response);
        const updatedNotes = this.userNotes.filter((note) => note.id !== noteId);
        this.userNotes = updatedNotes;
        this.notesUpdated.next([...this.userNotes]);
        // this.router.navigate(['/notes']).then(() => window.location.reload())
      });
  }

  getNotesUpdateListener(): Observable<Note[]> {
    return this.notesUpdated.asObservable();
  }

  getNote(id: string): Observable<Note> {
    // return this.httpClient.get<Note>(this.localNotesUrl + id).pipe(
    return this.httpClient.get<Note>(this.notesUrl + id).pipe(
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
