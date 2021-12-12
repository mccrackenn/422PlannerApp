import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscriber, Subscription, Observable, of } from "rxjs";
import { ToDo } from '../models/toDo';
import { map, tap, timeout } from 'rxjs/operators';
import { SnackbarService } from './snackbar/snackbar.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
  })

export class ToDoServices
{
    private toDos: ToDo[] = [];
    private userToDos: ToDo[] = [];
    //local
    //private toDosUrl = 'http://localhost:3000/api/todos/'; 
    private azureUrl = 'https://mimicnodeserver.azurewebsites.net/api/todos/';
    //azure
    private toDosUrl = this.azureUrl;

    toDosUpdated = new Subject<ToDo[]>();
    toDoAdded = new Subject<ToDo>();

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public httpClient: HttpClient,
        public snackBar: SnackbarService,
        public authService: AuthService
    ) {}

    //local
    // getToDos(): Observable<ToDo[]> {
    //     return (
    //         this.httpClient
    //             .get<ToDo[]>(this.toDosUrl)
    //             // Using pipe & map so I can have a local copy of the todo array,without it Delete and Add elements don't show up initially without refresh
    //             .pipe(
    //                 map((toDos) =>
    //                     toDos.map((toDo) => {
    //                         toDo.startDateTime = new Date(toDo.startDateTime);
    //                         toDo.endDateTime = new Date(toDo.endDateTime);
    //                         toDo.createdDate = new Date(toDo.createdDate);
    //                     return toDo;
    //                     })
    //                 ),
    //                 tap((a) => (this.toDos = a))
    //             )
    //     );
    // }

    //azure  
    getToDos(): Observable<ToDo[]> {
        const newUser = this.authService.getUserValue(); // .getCurrentUser();
        if (!newUser) {
          return of(this.userToDos);
        }
        // console.log(newUser._id);
        return this.httpClient
          .post<ToDo[]>(this.toDosUrl + newUser._id, newUser)
          .pipe(
            map(
              (
                toDos // Mapping operation was needed to convert dates back to date objects
              ) =>
                toDos.map((toDo) => {
                  toDo.startDateTime = new Date(toDo.startDateTime);
                  toDo.endDateTime = new Date(toDo.endDateTime);
                  toDo.createdDate = new Date(toDo.createdDate);
                  return toDo;
                })
            ),
            tap((a) => (this.userToDos = a))
          );
      }

    addToDo(toDo: ToDo): void {
        const currentUser = this.authService.getUserValue();
        if (!currentUser) {
            console.log('Failed to add ToDo....');
            return;
        }
        const _id = currentUser._id;
        this.httpClient
            .post<{ message: string; toDoId: string }>(this.toDosUrl, {
                toDo,
                _id,
            })
        .subscribe((responseData) => {
            //todomodel
            const newToDo: ToDo = {
                id: responseData.toDoId,
                title: toDo.title,
                description: toDo.description,
                completed: toDo.completed,
                createdDate: toDo.createdDate,
                startDateTime: toDo.startDateTime,
                endDateTime: toDo.endDateTime,
            };
            //console.log(newToDo);
            this.userToDos.push(newToDo);
            this.toDosUpdated.next([...this.toDos]);
            this.toDoAdded.next(newToDo);
            this.snackBar.openSnackBar("ToDo Added","Dismiss")
            setTimeout(() =>{
            this.router.navigate(['/to-dos']).then(() => window.location.reload())

            },3000)
        });
    }

    updateToDo(toDo: ToDo): void {
        const id = toDo.id;
        // console.log(toDo);
        // console.log(id);
        this.httpClient
            .put<{ message: string; toDoId: string }>(this.toDosUrl + id, toDo)
            .subscribe((responseData) => {
            console.log("Updated ToDo Successfully. " + responseData);
            });
            this.snackBar.openSnackBar("ToDo Edited","Dismiss")
            setTimeout(() =>{
                this.router.navigate(['/to-dos']).then(()=> window.location.reload())

            },3000)
    }

    deleteToDo(toDoId: string): void {
        this.httpClient
            .delete(this.toDosUrl + toDoId)
            .subscribe((response) => {
                console.log(response);
                const updatedToDos = this.userToDos.filter((toDo) => toDo.id !== toDoId);
                this.userToDos = updatedToDos;
                this.toDosUpdated.next([...this.userToDos]);
                this.snackBar.openSnackBar("ToDo Deleted","Done");
            });
    }

    getToDosUpdateListener(): Observable<ToDo[]>
    {
        return this.toDosUpdated.asObservable();
    }

    getToDo(id: string): Observable<ToDo> {
        console.log(this.toDosUrl + id);
        return this.httpClient.get<ToDo>(this.toDosUrl + id).pipe(
            map((oneToDo) => {
              oneToDo.startDateTime = new Date(oneToDo.startDateTime);
              oneToDo.endDateTime = new Date(oneToDo.endDateTime);
              oneToDo.createdDate = new Date(oneToDo.createdDate);
              return oneToDo;
            })
        );
    }
}
