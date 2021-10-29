import { ToDo } from './ToDo';
import { Note } from './note';

export interface CalendarItem {
    id: number;
    date: Date;
    isHoliday: boolean;
    listOfToDos: ToDo[];
    listOfNotes: Note[];
}