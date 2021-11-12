import { Component, OnInit, Inject } from '@angular/core';
import { ToDo } from 'src/app/models/toDo';
import { ToDoItem } from 'src/app/models/toDoItem';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-todo',
  templateUrl: './view-todo.component.html',
  styleUrls: ['./view-todo.component.css']
})
export class ViewTodoComponent implements OnInit {

  todo: ToDo;

  constructor(private dlgRef: MatDialogRef<ViewTodoComponent>,
              @Inject(MAT_DIALOG_DATA) data: any) {
                this.todo = data.todo;
                // console.log('Received Todo to Display: ', this.todo);
              }

  edit(): void {
    this.dlgRef.close('edit');
  }

  close(): void {
    this.dlgRef.close('');
  }

  ngOnInit(): void {
  }

}
