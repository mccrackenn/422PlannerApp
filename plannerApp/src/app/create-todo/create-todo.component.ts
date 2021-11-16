import { not } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToDoServices } from '../services/toDo.services'
import { ToDo } from '../models/toDo'
import { ToDoItem } from '../models/toDoItem';

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
    public toDoService: ToDoServices
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
        title: new FormControl(null, { validators: [Validators.required] }),
        description: new FormControl(null, { validators: [Validators.required] }),
        startDate: new FormControl(null, { validators: [Validators.required] }),
        endDate: new FormControl(null, { validators: [Validators.required] }),
        createdDate: new FormControl(null, { validators: [Validators.required] }),
        //change? add listOfItems?
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('toDoId')) {
            this.mode = 'edit';
            this.postId = paramMap.get('toDoId');
            console.log(this.postId);
            this.toDoService.getToDo(this.postId!).subscribe((responseData) => {
                console.log(typeof responseData.createdDate);
                this.toDo = {
                    id: responseData.id,
                    title: responseData.title,
                    description: responseData.description,
                    startDate: responseData.startDate,
                    endDate: responseData.endDate,
                    createdDate: responseData.createdDate,
                    //change?
                    listOfItems: responseData.listOfItems,
                };
                this.form.setValue({
                    title: this.toDo.title,
                    description: this.toDo.description,
                    startDate: this.toDo.startDate,
                    endDate: this.toDo.endDate,
                    createdDate: this.toDo.createdDate,
                });
                console.log(typeof this.toDo?.createdDate);
            });
            //console.log(this.toDo);
            //this.form.setValue({
            //    title: this.toDo?.title,
            //    description: this.toDo?.description,
            //    startDate: this.toDo?.createdDate.toDateString()
        }
      });
  }
}