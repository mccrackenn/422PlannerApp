import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscriber, Subscription, Observable } from 'rxjs';
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
  private localUserUrl = 'http://localhost:3000/api/users/';

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

  getNotes(): Observable<Note[]> {
    // console.log('Retrieving notes from : ' + this.notesUrl);
    return (
      this.httpClient
        .get<Note[]>(this.localNotesUrl)
        //.get<Note[]>(this.notesUrl)
        // Using pipe & map so I can have a local copy of the note array,without it Delete and Add elements don't show up initially without refresh
        // .pipe(map((notes) => (this.notes = notes)));
        .pipe(
          map((notes) =>
            notes.map((note) => {
              note.startDate = new Date(note.startDate);
              note.endDate = new Date(note.endDate);
              note.createdDate = new Date(note.createdDate);
              return note;
            })
          ),
          tap((a) => (this.notes = a))
        )
    );
    // httpClient.get<Hero[]>(url).pipe(
    //   map(hero => hero.map(h => {
    //       h.dateOfBirth = new Date(h.dateOfBirth);
    //       return h;
    //   })))
  }

  getUserNotes(): Observable<Note[]> {
    const newUser = this.authService.getCurrentUser();
    console.log(newUser._id);
    return (
      this.httpClient
        .post<Note[]>(this.localNotesUrl + '/' + newUser._id, newUser)
        //.post<Note[]>(this.notesUrl + newUser._id, newUser)
        .pipe(
          map(
            (
              notes //Mapping operation was needed to convert dates back to date objects
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

  addNote(note: Note) {
    const currentUser = this.authService.getCurrentUser();
    const _id = currentUser._id;
    this.httpClient
      .post<{ message: string; noteId: string }>(
       this.localNotesUrl,
        {
          note,
          _id,
        }
      )
      .subscribe((responseData) => {
        console.log(responseData)
        const newNote: Note = {
          id: responseData.noteId,
          title: note.title,
          description: note.description,
          startDate: note.startDate,
          endDate: note.endDate,
          createdDate: note.createdDate,
        };
        console.log(newNote);
        this.userNotes.push(newNote);
        //console.log(this.notes);
        this.notesUpdated.next([...this.userNotes]);
        this.noteAdded.next(newNote);
        //this.router.navigate(['/notes']).then(()=>console.log('hello'));
        //this.snackBar.openSnackBar("message","action")
      });
  }

  updateNote(note: Note): void {
    const id = note.id;
    console.log(note);
    console.log(id);
    this.httpClient
      .put<{ message: string; noteId: string }>(this.localNotesUrl + id, note)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  deleteNote(noteId: string) {
    this.httpClient
      .delete(this.localNotesUrl + noteId)
      .subscribe((response) => {
        console.log(response);
        const updatedNotes = this.userNotes.filter((note) => note.id !== noteId);
        this.userNotes = updatedNotes;
        this.notesUpdated.next([...this.userNotes]);
        // this.router.navigate(['/notes']).then(() => window.location.reload())
      });
  }

  getNotesUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  getNote(id: string) {
    return this.httpClient.get<Note>(this.localNotesUrl + id).pipe(
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
