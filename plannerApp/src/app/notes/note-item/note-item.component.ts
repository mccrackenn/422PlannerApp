import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/models/note';
import { NotesServices } from 'src/app/services/notes.services';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.css']
})
export class NoteItemComponent implements OnInit
{

  @Input() note?: Note
  @Input() index?: number

  constructor(private notesServices: NotesServices) { }

  ngOnInit(): void
  {

  }
  deleteNote(id: string)
  {
    this.notesServices.deleteNote(id)
  }

}
