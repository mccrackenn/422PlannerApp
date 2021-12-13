import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ToDoServices } from '../services/toDo.services'
import { ToDo } from '../models/toDo'
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-to-dos',
    templateUrl: './to-dos.component.html',
    styleUrls: ['./to-dos.component.css']
})
export class ToDosComponent implements OnInit {
    form!: FormGroup;
    searchForm!: FormGroup;
    createToDoForm!: FormGroup;
    private toDosSub: Subscription = new Subscription();
    public toDoTabIndex = 0;  // sets which tab to load
    filteredOptions?: Observable<ToDo[]>;

    toDos: ToDo[] = [];
    searchToDos: ToDo[] = [];

    constructor(
        private toDoService: ToDoServices,
        public snackBar: SnackbarService,
        private authService: AuthService,
        private router: Router
    ) {
        if (! this.authService.isAutheticated) {
            router.navigate(['']);
        }
    }

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

        this.searchForm = new FormGroup({
            searchDate: new FormControl(null, { validators: [Validators.required] }),
        });

        // todomodel
        this.createToDoForm = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required] }),
            description: new FormControl(null, { validators: [Validators.required] }),
            completed: new FormControl(false, { validators: [Validators.required] }),
            startDateTime: new FormControl(null, { validators: [Validators.required] }),
            endDateTime: new FormControl(null, { validators: [Validators.required] }),
        });

        // sets opening tab
        if (this.router.url == '/to-dos/createToDo') {
            this.toDoTabIndex = 1;
        } else {
            this.toDoTabIndex = 0;
        }
    }

    getUserToDos(): void {
        this.toDoService.getToDos().subscribe(result => console.log(result));
    }

    ngOnChanges():void{
        this.toDoService.getToDosUpdateListener();
    }

    //Sorts by date created and completed
    sortToDo() {
        // let sortArr = todo;
        let sortArr = this.toDos;
        if (this.searchToDos.length != 0) {
            sortArr = this.searchToDos;
        }       
        let newestFirstArr = sortArr.sort(function(a, b) {
            if (a.createdDate < b.createdDate) {
                return 1;
            }
            if (a.createdDate > b.createdDate) {
                return -1;
            }
            else {
                return 0;
            }
        });

        return newestFirstArr.sort(function(a, b) {
            if (a.completed) {
                return 1;
            }
            if (a.completed == false && b.completed) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }

    onSearchDate(event: MatDatepickerInputEvent<Date>): void {
        // date from user (matching 1 selected day to the start dates of todos for simplicity)
        let searchDate: Date = this.searchForm.value.searchDate;

        console.log("search date: " + searchDate.toISOString());
        if (searchDate != null) {
            // search and filter through todos to find where the user entered date and start date are the same
            this.searchToDos = this.toDos.filter(function(i: ToDo): any {
                if (new Date(i.startDateTime).getTime() == searchDate.getTime()) {
                    console.log(i.startDateTime);
                    console.log('TRUE');
                    return true;
                }
                else {
                    console.log(i.startDateTime);
                    console.log('FALSE');
                    return false;
                }
            });

            // if no result throw snackBar.
            if (this.searchToDos.length == 0) {
                this.snackBar.openSnackBar("No ToDos with that start date", "Close");
            }
        }
    }

    submitNewToDo(): void {
        //todomodel
        const newToDo: ToDo = {
          id: 'temp',
          title: this.createToDoForm.value.title,
          description: this.createToDoForm.value.description,
          completed: this.createToDoForm.value.completed,
          startDateTime: this.createToDoForm.value.startDateTime,
          endDateTime: this.createToDoForm.value.endDateTime,
          createdDate: new Date(Date.now()),
        };
        this.toDoService.addToDo(newToDo);
        // console.log(newToDo);
        // console.log(this.createToDoForm.get('newToDo')?.value)
    }

    changeTabs($e: MatTabChangeEvent): void{
        if($e.index === 0){
          console.log($e);
        }
    }

    date(e: any): void {
        const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
        this.form.get('dob')?.setValue(convertDate, {
          onlyself: true,
        });
        console.log(convertDate);
    }
}
