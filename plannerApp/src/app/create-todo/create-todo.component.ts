import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToDoServices } from '../services/toDo.services'
import { ToDo } from '../models/toDo'
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css'],
})
export class CreateToDoComponent implements OnInit {
  private toDoId: string | null | undefined;
  toDo?: ToDo;
  form!: FormGroup;
  loading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public toDoService: ToDoServices,
    public snackBar: SnackbarService
  ) {
    if (! this.authService.isAutheticated) {
      router.navigate(['']);
    }
  }

  ngOnInit() {
    //todomodel
    this.form = new FormGroup({
        title: new FormControl(null, { validators: [Validators.required] }),
        description: new FormControl(null, { validators: [Validators.required] }),
        completed: new FormControl(null, { validators: [Validators.required] }),
        createdDate: new FormControl(null),
        startDateTime: new FormControl(null, { validators: [Validators.required] }),
        endDateTime: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('toDoId')) {
            this.toDoId = paramMap.get('toDoId');
            console.log(this.toDoId);
            this.toDoService.getToDo(this.toDoId!).subscribe((responseData) => {
                //todomodel
                this.toDo = {
                    id: responseData.id,
                    title: responseData.title,
                    description: responseData.description,
                    completed: responseData.completed,
                    createdDate: responseData.createdDate,
                    startDateTime: responseData.startDateTime,
                    endDateTime: responseData.endDateTime,
                };
                //todomodel
                console.log('Received ToDo to edit: ' + this.toDo);
                this.form.setValue({
                    title: this.toDo.title,
                    description: this.toDo.description,
                    completed: this.toDo.completed,
                    createdDate: this.toDo.createdDate,
                    startDateTime: this.toDo.startDateTime,
                    endDateTime: this.toDo.endDateTime,
                });
            });
        }
      });
  }

  saveToDo(): void {
    if (this.form.invalid) {
        console.log("invalid!")
        return;
    }
    this.loading = true;
    if (this.toDo) {
      //console.log("Create");
      //console.log(this.toDo);
      this.toDo.title = this.form.value.title;
      this.toDo.description = this.form.value.description;
      this.toDo.completed = this.form.value.completed;
      this.toDo.startDateTime = this.form.value.startDateTime;
      this.toDo.endDateTime = this.form.value.endDateTime;
      this.toDo.createdDate = new Date(Date.now());
      
      this.toDoService.updateToDo(this.toDo);
    }
  }
}