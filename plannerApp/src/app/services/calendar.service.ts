import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { Calendar } from '../models/calendar';
import { CalendarItem } from '../models/calendarItem';
import { NotesServices } from 'src/services/notes.services';
import { Note } from '../models/note';
import { EventInput } from '@fullcalendar/core';

// import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CalendarService {

  private calItems: Array<CalendarItem> = [];

  constructor(private noteService: NotesServices) { }

  private populateCalItems(): void {
    let c1 = new CalendarItem();
    c1 = c1.createCalendarItem(1, new Date(2021, 11, 4), this.noteService.getNotes());

    const notes: Note[] = [
      {id: 1, title: '422 Notes', description: 'Notes for 422',
        createdDate: new Date(2021, 10, 5),
        startDate: new Date(2021, 11, 10), endDate: new Date(2021, 11, 15)},
      {id: 2, title: '10 Day Note', description: 'Note for 10 days',
        createdDate: new Date(2021, 9, 18),
        startDate: new Date(2021, 10, 15), endDate: new Date(2021, 10, 25)},
      {id: 3, title: 'Date Issue Note', description: 'Dates Issue',
        createdDate: new Date(2021, 9, 18),
        startDate: new Date('11-1-2021'), endDate: new Date('11-10-2021')}
    ];
    let c2 = new CalendarItem();
    c2 = c2.createCalendarItem(2, new Date(2021, 11, 1), notes);

    this.calItems.push(c1);
    this.calItems.push(c2);
  }

  // Get CalendarItems for specified month as an Array
  getCalendarItemsOfMonth(monthNumber: number): Array<CalendarItem> {
    if (this.calItems.length === 0) {
      this.populateCalItems();
    }

    const itemForMonth = this.calItems.filter(item => item.date.getMonth() === monthNumber);

    return itemForMonth;
  }

  getNotesOfMonthAsEvents(monthNumber: number): EventInput[] {
    const event: EventInput[] = [];

    const notes = this.getNotesOfMonth(monthNumber); // Array<Note>

    notes.forEach(note => {
      // event.push({ id: note.id.toString(), start: note.startDate.toISOString(),
      //   end: note.endDate.toISOString(), editable: true, interactive: true });
      event.push(this.createEventObject(note));
    });

    return event;
  }

  private createEventObject(note: Note): any {
    const offsetInMins = 2 * 60;
    const startStr = new Date(note.startDate.getTime() + offsetInMins * 60000).toISOString();
    // new Date(note.startDate.toString().split('GMT')[0] + ' UTC').toISOString();
    return { id: note.id.toString(), title: note.title, start: startStr,
      end: note.endDate.toISOString(), editable: true, interactive: true };
  }

  // Get Notes for specified month as Array<Note>
  getNotesOfMonth(monthNumber: number): Array<Note> {
    if (this.calItems.length === 0) {
      this.populateCalItems();
    }

    const notes = new Array<Note>();

    this.calItems.forEach(element => {
      if (element.listOfNotes.length > 0) {
        notes.push(...element.listOfNotes);
      }
    });

    return notes;
  }

  // Not Used currently
   // Get Notes for specified month as JSON Object of arrays
  getNotesOfMonthAsJSON(monthNumber: number): any {
    if (this.calItems.length === 0) {
      this.populateCalItems();
    }

    const notes = new Array<Note>();

    this.calItems.forEach(element => {
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
