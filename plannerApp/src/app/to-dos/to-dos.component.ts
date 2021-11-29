import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ToDoServices } from '../services/toDo.services'
import { ToDo } from '../models/toDo'

@Component({
    selector: 'app-to-dos',
    templateUrl: './to-dos.component.html',
    styleUrls: ['./to-dos.component.css']
})
export class ToDosComponent implements OnInit {

    form!: FormGroup;
    createToDoForm!: FormGroup;
    private toDosSub: Subscription = new Subscription();
    filteredOptions?: Observable<ToDo[]>;

    //isCompleted!: boolean;
  
    toDos: ToDo[] = [];
  
    constructor(private toDoService: ToDoServices, ) {}

    ngOnInit(): void {
        this.toDoService.getToDos().subscribe((toDos) => (this.toDos = toDos));
        this.toDosSub = this.toDoService
        .getToDosUpdateListener()
        .subscribe((toDos: ToDo[]) => {
            this.toDos = toDos;
        });

        this.form = new FormGroup({
            dob: new FormControl(null, {
                validators: [Validators.minLength(3), Validators.required],
            }),
            toDo: new FormControl(null, { 
                validators: [Validators.required] 
            }),
        });
        //todomodel
        this.createToDoForm = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required] }),
            description: new FormControl(null, { validators: [Validators.required] }),
            completed: new FormControl(false, { validators: [Validators.required] }),
            //notification? (thinking no on this one)
            startDateTime: new FormControl(null, { validators: [Validators.required] }),
            endDateTime: new FormControl(null, { validators: [Validators.required] }),
        });
    }

    onSaveDate() {}

    submitNewToDo() {
        //todomodel
        const newToDo: ToDo = {
          id: 'temp',
          title: this.createToDoForm.value.title,
          description: this.createToDoForm.value.description,
          completed: this.createToDoForm.value.completed,
          notification: false,
          startDateTime: this.createToDoForm.value.startDateTime,
          endDateTime: this.createToDoForm.value.endDateTime,
          createdDate: new Date(Date.now()),
        };
        this.toDoService.addToDo(newToDo);
        console.log(this.createToDoForm.value.completed);
        // console.log(this.createToDoForm.get('newToDo')?.value)
        // console.log(this.createToDoForm.value.start)
        // console.log(this.createToDoForm.value.end)
    }

    date(e: any) {
        const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
        this.form.get('dob')?.setValue(convertDate, {
          onlyself: true,
        });
        console.log(convertDate);
    }
}
