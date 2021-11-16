import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscriber, Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ToDo } from '../models/toDo';
import { ToDoItem } from '../models/toDoItem';

@Injectable({
    providedIn: 'root'
  })

export class ToDoServices
{
    private toDos: ToDo[] = [

    ];

    toDosUpdated = new Subject<ToDo[]>();

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public httpClient: HttpClient
    ) { };

    getToDos()
    {
    //Use the spread operator to return a copy of the array
        this.httpClient.get<ToDo[]>('http://localhost:3000/api/todos').subscribe(
        responseData =>
        {
            console.log(responseData)
            this.toDos = responseData
            this.toDosUpdated.next([...this.toDos])
        })
    }

    getToDosUpdateListener()
    {
        return this.toDosUpdated.asObservable()
    }
}