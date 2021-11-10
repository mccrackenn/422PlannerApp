import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscriber, Subscription } from "rxjs";
import { Note } from "src/app/models/note";

@Injectable({
  providedIn: 'root'
})
export class NotesServices
{
  private notes: Note[] = [

  ];

  notesUpdated = new Subject<Note[]>();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public httpClient: HttpClient
  ) { };

  getNotes()
  {
    //Using the spread opertor to return a copy of the array, not the original array
    this.httpClient.get<Note[]>('http://localhost:3000/api/notes').subscribe(
      responseData =>
      {
        console.log(responseData)
        this.notes = responseData
        this.notesUpdated.next([...this.notes])
      })
  }

  getHeroesUpdateListener()
  {
    return this.notesUpdated.asObservable()
  }

  getNote(id: number)
  {
    console.log(`Note is ${id}`)
    const returnNote = this.notes.find(note => note.id === id)
    console.log(`getNote return an id of-${id}`)
  }

}
