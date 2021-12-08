import { Component, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotesServices } from '../services/notes.services';
import { Note } from '../models/note';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit, OnChanges {
  form!: FormGroup;
  createNoteForm!: FormGroup;
  private notesSub: Subscription = new Subscription();
  filteredOptions?: Observable<Note[]>;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  noteAddedNotification: Subscription = new Subscription();


  notes: Note[] = [];

  constructor(
    private notesService: NotesServices,
    public snackBar: SnackbarService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('IsAuthenticated? ' + this.authService.isAutheticated);
    if (! this.authService.isAutheticated) {
      router.navigate(['']);
    }

    const currentYear = new Date().getFullYear();
    //this.minDate = new Date(currentYear - 5, 12, 99);
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.minDate.getDate() + 20);
    //this.maxDate = new Date(currentYear - 1, 12, 99);
  }

  ngOnInit(): void {
    this.notesService.getNotes().subscribe((notes) => (this.notes = notes));

    //this.notesService.getNotes().subscribe((notes) => (this.notes = notes));
    this.notesSub = this.notesService
      .getNotesUpdateListener()
      .subscribe((notes: Note[]) => {
        this.notes = notes;
      });

    this.form = new FormGroup({
      dob: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.required],
      }),
      note: new FormControl(null, { validators: [Validators.required] }),
    });
    this.createNoteForm = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      endDate: new FormControl(null, { validators: [Validators.required] }),
    });
    this.noteAddedNotification = this.notesService.noteAdded.subscribe(
     note => setTimeout(()=>{
      console.log(note)
      },2500)
    );
  }

  getUserNotes() {
    this.notesService.getNotes().subscribe(result => console.log(result));
  }

  ngOnChanges(){
    this.notesService.getNotesUpdateListener();
  }

  onSaveDate() {}
  submitNewNote() {
    const newNote: Note = {
      id: 'temp',
      title: this.createNoteForm.value.title,
      description: this.createNoteForm.value.description,
      startDate: this.createNoteForm.value.startDate,
      endDate: this.createNoteForm.value.endDate,
      createdDate: new Date(Date.now()),

    };

    console.log(newNote.startDate);
    this.notesService.addNote(newNote);
    //this.createNoteForm.reset()
    //this.router.navigate(['/notes'])
    // console.log(this.createNoteForm.get('newNote')?.value)
    // console.log(this.createNoteForm.value.start)
    // console.log(this.createNoteForm.value.end)
  }

  changeTabs($e: MatTabChangeEvent){
    if($e.index === 0){
      console.log($e)
      //this.notesService.getNotesUpdateListener()
    }
    //this.fetchAccounts(this.banks[$event.index].id)
}

  date(e: any) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.form.get('dob')?.setValue(convertDate, {
      onlyself: true,
    });
    console.log(convertDate);
  }
}
