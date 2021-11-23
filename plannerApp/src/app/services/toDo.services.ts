import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscriber, Subscription, Observable } from "rxjs";
import { ToDo } from '../models/toDo';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class ToDoServices
{
    private toDos: ToDo[] = [];

    toDosUpdated = new Subject<ToDo[]>();

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public httpClient: HttpClient
    ) {}

    getToDos(): Observable<ToDo[]> {
        return this.httpClient
          .get<ToDo[]>('http://localhost:3000/api/todos')
          //Using pipe & map to keep a local copy of the todo array
          //without it Delete and Add elements don't show up initially without refresh
          .pipe(map((toDos) => (this.toDos = toDos)));
      }

    addToDo(toDo: ToDo) {
        this.httpClient
            .post<{ message: string; toDoId: string }>(
            'http://localhost:3000/api/todos',
            toDo
            )
        .subscribe((responseData) => {
            const newToDo: ToDo = {
                id: responseData.toDoId,
                title: toDo.title,
                description: toDo.description,
                startDate: toDo.startDate,
                endDate: toDo.endDate,
                createdDate: toDo.createdDate,
                //change??
                listOfItems: toDo.listOfItems
            };
            console.log(newToDo);
            this.toDos.push(newToDo);
            console.log(this.toDos);
            this.toDosUpdated.next([...this.toDos]);
            this.router.navigate(['/todos']).then(() => window.location.reload());
        });
    }

    deleteToDo(toDoId: string) {
        this.httpClient
            .delete('http://localhost:3000/api/todos/' + toDoId)
            .subscribe(() => {
                console.log(this.toDos);
                const updatedToDos = this.toDos.filter((toDo) => toDo.id !== toDoId);
                console.log(updatedToDos);
                this.toDos = updatedToDos;
                this.toDosUpdated.next([...this.toDos]);
                //this.router.navigate(['/toDos']).then(() => window.location.reload())
          });
    }
    getToDo(id: string) {
        return this.httpClient.get<ToDo>('http://localhost:3000/api/todos/' + id);
        //console.log(`ToDo is ${id}`)
        //const returnToDo = this.toDos.find(toDo => toDo.id === id)
        //console.log(`getToDo return an id of-${id}`)
    }
    getToDosUpdateListener()
    {
        return this.toDosUpdated.asObservable()
    }
}