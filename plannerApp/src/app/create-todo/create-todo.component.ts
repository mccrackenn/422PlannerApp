import { not } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToDoServices } from '../services/toDo.services'
import { ToDo } from '../models/toDo'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css'],
})
export class CreateToDoComponent implements OnInit {
  private postId: string | null | undefined;
  private mode: string = '';
  toDo?: ToDo;
  form!: FormGroup;

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public toDoService: ToDoServices
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
        createdDate: new FormControl(null, { validators: [Validators.required] }),
        startDateTime: new FormControl(null, { validators: [Validators.required] }),
        endDateTime: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('toDoId')) {
            this.mode = 'edit';
            this.postId = paramMap.get('toDoId');
            console.log(this.postId);
            this.toDoService.getToDo(this.postId!).subscribe((responseData) => {
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

  updateToDo(): void {
    if (this.toDo) {
      console.log("Create");
      console.log(this.toDo);
      this.toDo.title = this.form.value.title;
      this.toDo.description = this.form.value.description;
      this.toDo.completed = this.form.value.completed;
      this.toDo.startDateTime = this.form.value.startDate;
      this.toDo.endDateTime = this.form.value.endDate;
      this.toDo.createdDate = this.form.value.createdDate;
      
      this.toDoService.updateToDo(this.toDo);
    }
  }
}