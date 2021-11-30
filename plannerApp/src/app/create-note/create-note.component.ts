import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NotesServices } from '../services/notes.services';
import { Note } from '../models/note';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css'],
})
export class CreateNoteComponent implements OnInit {
  private noteId: string | null | undefined;
  private mode: string = '';
  note?: Note;
  form!: FormGroup;

  constructor(
    public route: ActivatedRoute,
    public notesService: NotesServices,
    public snackBar:SnackbarService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      startDateA:new FormControl(null, {validators:[Validators.required]}),
      endDate: new FormControl(null, { validators: [Validators.required] }),
      endDateA: new FormControl(null, { validators: [Validators.required] }),
      createdDate: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('noteId')) {
        this.mode = 'edit';
        this.noteId = paramMap.get('noteId');
        console.log(this.noteId);
        this.notesService.getNote(this.noteId!).subscribe((responseData) => {
          console.log(responseData);
          this.note = {
            id: responseData.id,
            title: responseData.title,
            description: responseData.description,
            startDate: responseData.startDate,
            endDate: responseData.endDate,
            createdDate: responseData.createdDate,
          };
          console.log(this.note);
          this.form.setValue({
            title: this.note.title,
            description: this.note.description,
            startDate: this.note.startDate.toDateString(),
            endDate: this.note.endDate.toDateString(),
            startDateA:this.note.startDate,
            endDateA:this.note.endDate,
            createdDate: this.note.createdDate.toDateString(),
          });
        });
      }
    });
  }

  updateNote(): void {
    if (this.note) {
      this.note.title = this.form.value.title;
      this.note.description = this.form.value.description;
      this.note.startDate = this.form.value.startDate;
      this.note.endDate = this.form.value.endDate;
      this.note.createdDate = this.form.value.createdDate;
      console.log('Going to service....');
      this.notesService.updateNote(this.note);
    }
  }
}
