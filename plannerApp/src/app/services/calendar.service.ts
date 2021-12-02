import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CalendarItem } from '../models/calendarItem';
import { NotesServices } from './notes.services';
import { Note } from '../models/note';
import { EventInput } from '@fullcalendar/core';
import { ToDo } from '../models/toDo';
import { FoundNote } from '../models/foundNote';
import { FoundTodo } from '../models/foundTodo';
import { map } from 'rxjs/operators';
import { ToDoServices } from './toDo.services';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private calItems: Array<CalendarItem> = [];
  private notes: Note[] = [];
  private noteEvents: EventInput[] = [];
  private todos: ToDo[] = [];
  private todoCompletedEvents: EventInput[] = [];
  private todoNotCompletedEvents: EventInput[] = [];
  EVENT_TYPE_NOTE = 'N';
  EVENT_TYPE_TODO = 'T';

  constructor(private noteService: NotesServices,
              private todoService: ToDoServices) {}


  // Retrieve the Note from notes[] by passing the note id
  getNote(id: string): FoundNote {
    let ret: FoundNote = new FoundNote();
    const a = this.notes.find(n => n.id === id);
    if (a !== undefined) {
      ret = { found: true, note: a };
      return ret;
    }
    else {
      ret = { found: false };
      return ret;
    }
  }

  // Updates passed note in the DB
  updateNote(note: Note): void {
    this.noteService.updateNote(note);
  }

  // Retrieve the ToDo from todos[] by passing the todo id
  getTodo(id: string): FoundTodo {
    let ret: FoundTodo = new FoundTodo();
    const t = this.todos.find(n => n.id === id);
    if (t !== undefined) {
      ret = { found: true, todo: t };
    } else {
      ret = { found: false };
    }

    return ret;
  }

  // Retrieve all Notes as EventInput[]
  getNoteEvents(): Observable<Array<EventInput>> {
    const events: EventInput[] = [];
    return this.noteService.getNotes().pipe(map((data: any) => {
      this.noteEvents = [];
      this.notes = [];
      data.forEach((note: Note) => {
        const n = this.createNoteAsEventObject(note);
        this.noteEvents.push(n);
        this.notes.push(note);
      });
      return this.noteEvents;
    }));
  }

  // Works equivalent to GetNoteEvents() - this implementation uses Subjec<>
  getNoteEvents1(): Observable<Array<EventInput>> {
    const events: EventInput[] = [];
    const result: Subject<Array<EventInput>> = new Subject<Array<EventInput>>();
    this.noteService.getNotes().subscribe((data: any) => {
      this.notes = data;
      this.notes.forEach(note => {
        const n = this.createNoteAsEventObject(note);
        events.push(n);
      });
      result.next(events);
      result.complete();
    });
    return result;
  }


  // NOT USED - Retrieve all ToDos Events in one
  getToDoEvents(): Observable<Array<EventInput>> {
    const events: EventInput[] = [];
    return this.todoService.getToDos().pipe(map((data: any) => {
      this.todoCompletedEvents = [];
      this.todos = [];
      data.forEach((todo: ToDo) => {
        // console.log('ToDo: title: ' + todo.title + ' Desc: ' + todo.description + 
        //  ' Completed: ' + todo.completed);
        const n = this.createToDoAsEventObject(todo);
        this.todos.push(todo);
        this.todoCompletedEvents.push(n);
      });
      return this.todoCompletedEvents;
    }));
  }

  // Fetches all todos from server, filters to Completed & NotCompleted. Returns nothing.
  fetchToDoEvents(): Observable<any> {
    return this.todoService.getToDos().pipe(map((data: any) => {
      this.todoCompletedEvents = [];
      this.todos = [];
      this.todoNotCompletedEvents = [];
      data.forEach((todo: ToDo) => {
        // console.log('ToDo: title: ' + todo.title + ' Desc: ' + todo.description + ' Completed: ' + todo.completed);
        const n = this.createToDoAsEventObject(todo);

        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index === -1) {
          this.todos.push(todo);
        } else {
          this.todos[index] = todo;
        }

        if (todo.completed) {
          this.todoCompletedEvents.push(n);
        } else {
          this.todoNotCompletedEvents.push(n);
        }
      });
      return;
    }));
  }

  // Returns the ToDo Completed Events
  getCompletedTodoEvents(): EventInput[] {
    return this.todoCompletedEvents;
  }

  // Returns the ToDo Not Completed Events
  getNotCompletedTodoEvents(): EventInput[] {
    return this.todoNotCompletedEvents;
  }

  // NOT USED, RIGHT NOW
  /*
    // NOT USED
  getNotesOfMonthAsEvents(monthNumber: number): EventInput[] {
    const event: EventInput[] = [];

    let notes: Note[] = [];
    this.getNotesOfMonth(monthNumber).subscribe(n => notes = n); // Array<Note>
    // console.log('In getNotesOfMonthAsEvents - month ' + monthNumber + ' Notes = ' );
    // console.log(notes);
    notes.forEach(note =>
    {
      const n = this.createNoteAsEventObject(note);
      // console.log('Converted to Event ' + n.stringObj);
      event.push(n);
    });

    return event;
  }

  // Retrieve all ToDos as EventInput[]
  getToDosOfMonthAsEvents(monthNumber: number): EventInput[] {
    const event: EventInput[] = [];

    this.todos = this.getInitialToDos(); // this.getToDosOfMonth(monthNumber);

    this.todos.forEach((todo) => {
      this.todoEvents.push(this.createToDoAsEventObject(todo));
    });

    return this.todoEvents;
  }

  getInitialToDos(): Array<ToDo> {
    const todos: ToDo[] = [
      {
        id: '1', title: 'ToDo 1', description: 'td1 desc', createdDate: new Date('11-6-2021'),
        startDateTime: new Date('11-7-2021'), endDateTime: new Date('11-7-2021'),
        completed: true, notification: false,
      },
      {
        id: '2', title: 'ToDo 2', description: 'td2 desc', createdDate: new Date('11-6-2021'),
        startDateTime: new Date('11-7-2021'), endDateTime: new Date('11-9-2021'),
        completed: false, notification: false,
      }
    ];

    return todos;
  }*/

  private createNoteAsEventObject(note: Note): any {
    const offsetInMins = 2 * 60;
    const startStr = note.startDate; // new Date(note.startDate.getTime() + offsetInMins * 60000).toISOString();
    // new Date(note.startDate.toString().split('GMT')[0] + ' UTC').toISOString();

    return {
      id: note.id.toString(), title: note.title, start: startStr,
      end: note.endDate, ofType: this.EVENT_TYPE_NOTE
    };
  }

  private createToDoAsEventObject(todo: ToDo): any {
    const offsetInMins = 2 * 60;
    const startStr = todo.startDateTime; /*new Date(
      todo.startDateTime.getTime() + offsetInMins * 60000
    ).toISOString();*/
    // new Date(note.startDate.toString().split('GMT')[0] + ' UTC').toISOString();
    return {
      id: todo.id.toString(), title: todo.title, start: startStr,
      end: todo.endDateTime, ofType: this.EVENT_TYPE_TODO
    };
  }

}
