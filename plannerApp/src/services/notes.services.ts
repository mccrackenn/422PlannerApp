import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Note } from "src/app/models/note";

@Injectable({
  providedIn:'root'
})
export class NotesServices{
  private notes:Note []=[
    {id:1,title:"My First Note",description:"My First Test Note",createdDate:new Date(2021,10,5),startDate:new Date(),endDate:new Date()},
    {id:2,title:"My Second Note",description:"My Second Test Note",createdDate:new Date(2021,9,18),startDate:new Date(),endDate:new Date()}
  ];

  constructor(
    public router:Router,
    public route:ActivatedRoute
    ){ };

  getNotes(){
    //Using the spread opertor to return a copy of the array, not the original array
    return [...this.notes]
  }

  getNote(id:number){
    console.log(`Note is ${id}`)
    const returnNote=this.notes.find(note => note.id === id)
    console.log(`getNote return an id of-${id}`)
  }

}
