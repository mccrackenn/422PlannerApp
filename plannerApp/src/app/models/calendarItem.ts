import { ToDo } from './toDo';
import { Note } from './note';

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

    createCalendarItem(id: number, dt: Date): CalendarItem {  // , listNotes: Array<Note>, listTodos: Array<ToDo>): CalendarItem {
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
}
