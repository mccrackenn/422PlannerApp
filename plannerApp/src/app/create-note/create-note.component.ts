import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NotesServices } from '../services/notes.services';
import { Note } from '../models/note';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css'],
})
export class CreateNoteComponent implements OnInit {
  private noteId: string | null | undefined;
  public mode: string = '';
  note?: Note;
  form!: FormGroup;
  loading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public notesService: NotesServices,
    public snackBar: SnackbarService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.isAutheticated) {
      router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDateA: new FormControl(null, { validators: [Validators.required] }),
      endDateA: new FormControl(null, { validators: [Validators.required] }),
      createdDate: new FormControl(null),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('noteId')) {
        this.mode = 'edit';
        this.noteId = paramMap.get('noteId');
        console.log(this.noteId);
        this.notesService.getNote(this.noteId!).subscribe((responseData) => {
          this.note = {
            id: responseData.id,
            title: responseData.title,
            description: responseData.description,
            startDate: responseData.startDate,
            endDate: responseData.endDate,
            createdDate: responseData.createdDate,
          };
          console.log('Received Note to edit: ' + this.note);
          this.form.setValue({
            title: this.note.title,
            description: this.note.description,
            startDateA: this.note.startDate,
            endDateA: this.note.endDate,
            createdDate: this.note.createdDate.toDateString(),
          });
        });
      } else {
        this.mode = 'create';
      }
    });
  }

  saveNote(): void {
    if (this.form.invalid) {
      console.log("invalid!")
      return;
    }
    this.loading = true;
    if(this.mode === 'create'){
      console.log("in the conditional")
      const newNote: Note = {
        id: 'temp',
        title: this.form.value.title,
        description: this.form.value.description,
        startDate: this.form.value.startDateA,
        endDate: this.form.value.endDateA,
        createdDate: new Date(Date.now()),

      };
      console.log(newNote)
      this.notesService.addNote(newNote);
    }else
    if (this.note) {
      this.note.title = this.form.value.title;
      this.note.description = this.form.value.description;
      this.note.startDate = this.form.value.startDateA;
      this.note.endDate = this.form.value.endDateA;
      this.note.createdDate = new Date(Date.now());
      this.notesService.updateNote(this.note);
    }
  }
}
