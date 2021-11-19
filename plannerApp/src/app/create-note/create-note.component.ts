import { not } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NotesServices } from '../services/notes.services';
import { Note } from '../models/note';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css'],
})
export class CreateNoteComponent implements OnInit {
  private postId: string | null | undefined;
  private mode: string = '';
  note?: Note;
  form!: FormGroup;

  constructor(
    public route: ActivatedRoute,
    public notesService: NotesServices
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      endDate: new FormControl(null, { validators: [Validators.required] }),
      createdDate: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('noteId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('noteId');
        console.log(this.postId);
        this.notesService.getNote(this.postId!).subscribe((responseData) => {
          console.log(typeof responseData.createdDate);
          this.note = {
            id: responseData.id,
            title: responseData.title,
            description: responseData.description,
            startDate: responseData.startDate,
            endDate: responseData.endDate,
            createdDate: responseData.createdDate,
          };
          this.form.setValue({
            title: this.note.title,
            description: this.note.description,
            startDate: this.note.startDate,
            endDate: this.note.endDate,
            createdDate: this.note.createdDate,
          });
          console.log(typeof this.note?.createdDate);
        });
        // console.log(this.note);
        // this.form.setValue({
        //   title: this.note?.title,
        //   description: this.note?.description,
        //   startDate: this.note?.createdDate.toDateString()
      }
    });
  }

  updateNote(): void {
    if (this.note) {
      this.note.title = this.form.value.title;
      this.note.description = this.form.value.description;
      this.note.startDate = this.form.value.startDate;
      this.note.endDate = this.form.value.endDate;

      console.log('Going to service....');
      this.notesService.updateNote(this.note);
    }
  }
}
