import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CalendarItem } from '../models/calendarItem';
import { NotesServices } from './notes.services';
import { Note } from '../models/note';
import { EventInput } from '@fullcalendar/core';
import { ToDo } from '../models/toDo';
import { ToDoItem } from '../models/toDoItem';

// import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private calItems: Array<CalendarItem> = [];

  constructor(private noteService: NotesServices) {}

  private populateCalItems(): void {
    let c1 = new CalendarItem();
    c1 = c1.createCalendarItem(1, new Date(2021, 11, 4));
    // c1.listOfNotes = this.noteService.getNotes();

    const notes: Note[] = [
      {
        id: '1',
        title: '422 Notes',
        description: 'Notes for 422',
        createdDate: new Date(2021, 10, 5),
        startDate: new Date(2021, 11, 10),
        endDate: new Date(2021, 11, 15),
      },
      {
        id: '2',
        title: '10 Day Note',
        description: 'Note for 10 days',
        createdDate: new Date(2021, 9, 18),
        startDate: new Date(2021, 10, 15),
        endDate: new Date(2021, 10, 25),
      },
      {
        id: '3',
        title: 'Date Issue Note',
        description: 'Dates Issue',
        createdDate: new Date(2021, 9, 18),
        startDate: new Date('11-1-2021'),
        endDate: new Date('11-10-2021'),
      },
    ];

    let c2 = new CalendarItem();
    c2 = c2.createCalendarItem(2, new Date(2021, 11, 1));
    c2.listOfNotes = notes;
    c2.listOfToDos = this.getInitialToDos();

    this.calItems.push(c1);
    this.calItems.push(c2);
  }

  // Get CalendarItems for specified month as an Array
  getCalendarItemsOfMonth(monthNumber: number): Observable<CalendarItem[]> {
    if (this.calItems.length === 0) {
      this.populateCalItems();
    }

    const itemForMonth = this.calItems.filter(
      (item) => item.date.getMonth() === monthNumber
    );

    return of(itemForMonth);
  }

  getNotesOfMonthAsEvents(monthNumber: number): EventInput[] {
    const event: EventInput[] = [];

    let notes: Note[] = [];

    this.getNotesOfMonth(monthNumber).subscribe((n) => (notes = n)); // Array<Note>

    notes.forEach((note) => {
      // event.push({ id: note.id.toString(), start: note.startDate.toISOString(),
      //   end: note.endDate.toISOString(), editable: true, interactive: true });
      event.push(this.createNoteAsEventObject(note));
    });

    return event;
  }

  // Get Notes for specified month as Array<Note>
  getNotesOfMonth(monthNumber: number): Observable<Note[]> {
    if (this.calItems.length === 0) {
      this.populateCalItems();
    }

    const notes = new Array<Note>();

    this.calItems.forEach((element) => {
      if (element.listOfNotes.length > 0) {
        notes.push(...element.listOfNotes);
      }
    });

    return of(notes);
  }

  getToDosOfMonthAsEvents(monthNumber: number): EventInput[] {
    const event: EventInput[] = [];

    const todos: ToDo[] = this.getToDosOfMonth(monthNumber);

    todos.forEach((todo) => {
      event.push(this.createToDoAsEventObject(todo));
    });

    return event;
  }

  // Get ToDos for specified month as Array<ToDo>
  getToDosOfMonth(monthNumber: number): ToDo[] {
    if (this.calItems.length === 0) {
      this.populateCalItems();
    }

    const todos = new Array<ToDo>();

    this.calItems.forEach((element) => {
      if (element.listOfToDos.length > 0) {
        todos.push(...element.listOfToDos);
      }
    });

    return todos;
  }

  getInitialToDos(): Array<ToDo> {
    const todos: ToDo[] = [
      {
        id: 1,
        todoTitle: 'ToDo 1',
        createdDate: new Date('11-6-2021'),
        startDate: new Date('11-7-2021'),
        endDate: new Date('11-7-2021'),
        listOfItems: [
          {
            id: 101,
            title: 'Task 1',
            createdDate: new Date('11-6-2021'),
            startDate: new Date('11-7-2021'),
            endDate: new Date('11-7-2021'),
          },
          {
            id: 102,
            title: 'Task 2',
            createdDate: new Date('11-6-2021'),
            startDate: new Date('11-7-2021'),
            endDate: new Date('11-7-2021'),
          },
        ],
      },
      {
        id: 2,
        todoTitle: 'ToDo 2',
        createdDate: new Date('11-6-2021'),
        startDate: new Date('11-7-2021'),
        endDate: new Date('11-9-2021'),
        listOfItems: [
          {
            id: 105,
            title: 'Task 11',
            createdDate: new Date('11-6-2021'),
            startDate: new Date('11-7-2021'),
            endDate: new Date('11-7-2021'),
          },
          {
            id: 106,
            title: 'Task 12',
            createdDate: new Date('11-6-2021'),
            startDate: new Date('11-7-2021'),
            endDate: new Date('11-9-2021'),
          },
        ],
      },
    ];

    return todos;
  }

  private createNoteAsEventObject(note: Note): any {
    const offsetInMins = 2 * 60;
    const startStr = new Date(note.startDate.getTime() + offsetInMins * 60000).toISOString();
    // new Date(note.startDate.toString().split('GMT')[0] + ' UTC').toISOString();

    return {
      id: note.id.toString(),
      title: note.title,
      start: startStr,
      end: note.endDate.toISOString(),
    };
  }

  private createToDoAsEventObject(todo: ToDo): any {
    const offsetInMins = 2 * 60;
    const startStr = new Date(
      todo.startDate.getTime() + offsetInMins * 60000
    ).toISOString();
    // new Date(note.startDate.toString().split('GMT')[0] + ' UTC').toISOString();
    return {
      id: todo.id.toString(),
      title: todo.todoTitle,
      start: startStr,
      end: todo.endDate.toISOString(),
    };
  }

  // Not Used currently
  // Get Notes for specified month as JSON Object of arrays
  getNotesOfMonthAsJSON(monthNumber: number): any {
    if (this.calItems.length === 0) {
      this.populateCalItems();
    }

    const notes = new Array<Note>();

    this.calItems.forEach((element) => {
      if (element.listOfNotes.length > 0) {
        notes.push(...element.listOfNotes);
      }
    });

    const stringJSON = JSON.stringify(notes);
    console.log('As Str: ' + stringJSON);
    const stringObj = JSON.parse(stringJSON);
    console.log('As Obj: ' + stringObj);

    return stringObj;
  }
}
