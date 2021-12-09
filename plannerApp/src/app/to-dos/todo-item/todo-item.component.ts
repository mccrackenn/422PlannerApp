import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToDo } from 'src/app/models/toDo';
import { ToDoServices } from 'src/app/services/toDo.services';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class ToDoItemComponent implements OnInit
{

  @Input() toDo?: ToDo
  @Input() index?: number

  constructor(private toDoServices: ToDoServices) { }

  ngOnInit(): void
  {

  }
  deleteToDo(id: string)
  {
    this.toDoServices.deleteToDo(id)
  }

}
