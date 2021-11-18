import { ToDo } from './toDo';
import { Note } from './note';
import { FoundNote } from './foundNote';
import { FoundTodo } from './foundTodo';

export class CalendarItem {
    id: number;
    date: Date;
    isHoliday: boolean;
    listOfToDos: Array<ToDo>;
    listOfNotes: Array<Note>;

    constructor() {
        this.id = 0;
        this.date = new Date();
        this.isHoliday = false;
        this.listOfNotes = new Array<Note>();
        this.listOfToDos = new Array<ToDo>();
    }

    createCalendarItem(id: number, dt: Date): CalendarItem {
        const item = new CalendarItem();
        item.id = id;
        item.date = dt;
        return item;
    }

    addNote(note: Note): void {
        this.listOfNotes.push(note);
    }

    addToDo(todo: ToDo): void {
        this.listOfToDos.push(todo);
    }

    getNote(id: string): FoundNote {
        let note: Note;
        const a = this.listOfNotes.find(n => n.id === id);
        if (a !== undefined) {
            note = a;
            return { found: true, note } ;
        }
        else {
            return { found: false };
        }
    }

    getTodo(id: string): FoundTodo {
        let todo: ToDo;
        const a = this.listOfToDos.find(n => n.id === id);
        if (a !== undefined) {
            todo = a;
            return { found: true, todo } ;
        }
        else {
            return { found: false };
        }
    }
}
