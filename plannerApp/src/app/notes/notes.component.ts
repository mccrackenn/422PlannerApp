import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NotesServices } from '../services/notes.services';
import { Note } from '../models/note';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit, OnChanges {
  form!: FormGroup;
  createNoteForm!: FormGroup;
  private notesSub: Subscription = new Subscription();
  filteredNotes!: Observable<Note[]>;
  minDate: Date = new Date();
  notes: Note[] = [];
  noteSearch = new FormControl();
  noteSearchSelected: boolean = false;
  noteSearchRangeSelected: boolean = false;
  noteSelected!: Note;
  searchStartDate = new FormControl();
  searchEndDate = new FormControl();
  inDateRangeArray: Note[] = [];

  constructor(
    private notesService: NotesServices,
    public snackBar: SnackbarService,
    private authService: AuthService,
    private router: Router
  ) {
    // console.log('IsAuthenticated? ' + this.authService.isAutheticated);
    if (!this.authService.isAutheticated) {
      router.navigate(['']);
    }

    const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear - 5, 12, 99);
    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit(): void {
    this.notesService.getNotes().subscribe((notes) => (this.notes = notes));

    // this.notesService.getNotes().subscribe((notes) => (this.notes = notes));
    this.notesSub = this.notesService
      .getNotesUpdateListener()
      .subscribe((notes: Note[]) => {
        this.notes = notes;
      });

    this.createNoteForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      endDate: new FormControl(null, { validators: [Validators.required] }),
    });

    this.filteredNotes = this.noteSearch.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  get title() {
    return this.createNoteForm.get('title');
  }

  notePicker(note: Note) {
    this.noteSearchRangeSelected=false;

    this.noteSelected = {
      id: note.id,
      title: note.title,
      description: note.description,
      startDate: note.startDate,
      endDate: note.endDate,
      createdDate: note.createdDate,
    };
    this.noteSearchSelected = true;
  }

  private _filter(value: string): Note[] {
    const filterValue = value.toLowerCase();
    return this.notes.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  getUserNotes(): void {
    this.notesService.getNotes().subscribe((result) => console.log(result));
  }

  ngOnChanges(): void {
    this.notesService.getNotesUpdateListener();
  }

  searchByDate() {
    const startDate = this.searchStartDate.value;
    const endDate = this.searchEndDate.value;
    this.noteSearchSelected=false;
    this.noteSearchRangeSelected=true;
    this.inDateRangeArray = this.notes.filter(
      (note) => note.endDate >= startDate && note.startDate <= endDate
    );

  }

  submitNewNote(): void {
    if (this.createNoteForm.invalid) {
      console.log('invalid');
      return;
    }

    const newNote: Note = {
      id: 'temp',
      title: this.createNoteForm.value.title,
      description: this.createNoteForm.value.description,
      startDate: this.createNoteForm.value.startDate,
      endDate: this.createNoteForm.value.endDate,
      createdDate: new Date(Date.now()),
    };
    this.notesService.addNote(newNote);
    // this.createNoteForm.reset()
    // this.router.navigate(['/notes'])
  }

  changeTabs($e: MatTabChangeEvent): void {
    if ($e.index === 0) {
      console.log($e);
    }
  }
}

// date(e: any): void {
//   const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
//   this.form.get('dob')?.setValue(convertDate, {
//     onlyself: true,
//   });
//   console.log(convertDate);
// }
