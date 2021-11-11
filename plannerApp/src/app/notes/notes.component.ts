import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NotesServices } from '../services/notes.services';
import { Note } from '../models/note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  form!: FormGroup;
  createNoteForm!: FormGroup;
  private notesSub: Subscription = new Subscription();
  filteredOptions?: Observable<Note[]>;

  notes: Note[] = [];

  constructor(private notesService: NotesServices) {}

  ngOnInit(): void {
    this.notesService.getNotes();
    this.notesSub = this.notesService
      .getHeroesUpdateListener()
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
    this.notesService.addNote(newNote);
    // console.log(this.createNoteForm.get('newNote')?.value)
    // console.log(this.createNoteForm.value.start)
    // console.log(this.createNoteForm.value.end)
  }


  date(e: any) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.form.get('dob')?.setValue(convertDate, {
      onlyself: true,
    });
    console.log(convertDate);
  }
}
