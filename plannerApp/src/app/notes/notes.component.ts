import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotesServices } from '../services/notes.services'
import { Note } from '../models/note'

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit
{

  form!: FormGroup;
  createNoteForm!: FormGroup;
  private notesSub: Subscription = new Subscription;
  notes: Note[] = [

  ];

  constructor(
    private notesService: NotesServices,
  ) { }

  ngOnInit(): void
  {

    this.notesService.getNotes()
    this.notesSub = this.notesService.getHeroesUpdateListener().subscribe(
      notes =>
      {
        this.notes = notes
      }
    )



    this.form = new FormGroup({
      dob: new FormControl(null, { validators: [Validators.minLength(3), Validators.required] }),
      note: new FormControl(null, { validators: [Validators.required] })
    })
    this.createNoteForm = new FormGroup({
      newNote: new FormControl(null, { validators: [Validators.required] }),
      start: new FormControl(null, { validators: [Validators.required] }),
      end: new FormControl(null, { validators: [Validators.required] }),
    })
  }
  onSaveDate()
  {

  }
  submitNewNote()
  {
    console.log('hello')
    console.log(this.createNoteForm.get('newNote')?.value)
  }
  getNotes()
  {

  }

  date(e: any)
  {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10)
    this.form.get('dob')?.setValue(convertDate, {
      onlyself: true

    })
    console.log(convertDate)
  }

}
