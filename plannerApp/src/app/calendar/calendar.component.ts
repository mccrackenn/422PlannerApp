import {
  Component,  OnInit,
  ChangeDetectorRef,  OnDestroy } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg, EventClickArg,
  EventApi, EventInput, EventContentArg,
  MountArg, EventDropArg } from '@fullcalendar/angular';

import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CalendarService } from '../services/calendar.service';
import { ViewNoteComponent } from '../dialogs/view-note/view-note.component';
import { Note } from '../models/note';
import { ToDo } from '../models/toDo';
import { ViewTodoComponent } from '../dialogs/view-todo/view-todo.component';
import { Router } from '@angular/router';
import { Preferences } from '../models/preferences';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})

export class CalendarComponent implements OnInit, OnDestroy {
  private currentEvents: EventApi[] = [];
  private noteEvents: EventInput[] = [];
  private todoEvents: EventInput[] = [];
  selectedDayEvents: EventApi[] = [];
  calendarVisible = true;
  private subscription?: Subscription;
  showWeekends  = true;
  preference: Preferences = new Preferences();

  // Calendar Options
  calendarOptions: CalendarOptions = {};

  // Date Select
  handleDateSelect(selectInfo: DateSelectArg): void {
    const calendarApi = selectInfo.view.calendar;
    /*console.log(
      'Selected Date: All Day: ' +
        selectInfo.allDay +
        ' Start: ' +
        selectInfo.startStr +
        ' End: ' +
        selectInfo.endStr +
        ' View: ' +
        selectInfo.view.title +
        ', ' +
        selectInfo.view.type
    );*/
    calendarApi.unselect();
  }

  // Date Click
  handleDateClick(arg: any): void {
    // alert('Date clicked: ' + arg.dateStr);
  }

  // Event Click - Open respective dialog
  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    const extended = event.extendedProps.ofType;

    if (extended === this.calService.EVENT_TYPE_NOTE) {
      const fn = this.calService.getNote(event.id);
      if (fn.found && fn.note) {
        this.openNoteDialog(fn.note);
      }
    }
    else if (extended === this.calService.EVENT_TYPE_TODO) {
      const ft = this.calService.getTodo(event.id);
      if (ft.found && ft.todo) {
        this.openTodoDialog(ft.todo);
      }
    }
  }

  handleDidMountEvent(info: MountArg<EventContentArg>): void
  {
    // Fires this event when an event is moved/dropped
    /*console.log('DisMount got FIRED...' + info.event.title);
    if (info.isDragging) {
      console.log('Dragging');
    }
    console.log('isSelected: ' + info.isSelected + ' Info: ' + info);
*/
  }

  handleEventDrop(drop: EventDropArg): void {
    const droppedEvent  = drop.event;
    const extended = droppedEvent.extendedProps.ofType;

    if (extended === this.calService.EVENT_TYPE_NOTE) {
      if (! this.updateDroppedNote(droppedEvent)) {
        drop.revert();
      }
    }
    else if (extended === this.calService.EVENT_TYPE_TODO) {
      if (! this.updateDroppedTodo(droppedEvent)) {
        drop.revert();
      }
    }
    else {
      drop.revert();
    }
  }

  handleWeekendsToggle(): void
  {
    this.showWeekends = !this.showWeekends;
    this.calendarOptions.weekends = this.showWeekends;

    return;
  }

  // EVENTS - handleEvents
  handleEvents(events: EventApi[]): void
  {
    this.currentEvents = events;
    // console.log(this.currentEvents);

    this.getSelectedDaysEvents(new Date());

    // console.log(this.selectedDayEvents);
    this.cd.detectChanges();
  }

  updateDroppedNote(droppedEvent: EventApi): boolean {
    let updated = false;
    const orgNoteEvent = this.noteEvents.find(e => e.id === droppedEvent.id);
    if (orgNoteEvent?.start !== droppedEvent.startStr ||
      orgNoteEvent?.end !== droppedEvent.endStr) {
        // console.log('Drag-Drop has occured.');
        const fn = this.calService.getNote(droppedEvent.id);
        if (fn.found && fn.note) {
          // console.log('Found Note: ' + fn.found);
          const note = fn.note;
          note.startDate = new Date(droppedEvent.startStr);
          note.endDate = new Date(droppedEvent.endStr);
          this.calService.updateNote(note);
          updated = true;
        }
    }
    return updated;
  }

  updateDroppedTodo(droppedEvent: EventApi): boolean {
    let updated = false;

    const orgTodoEvent = this.todoEvents.find(e => e.id === droppedEvent.id);
    if (orgTodoEvent?.start !== droppedEvent.startStr ||
      orgTodoEvent?.end !== droppedEvent.endStr) {
        console.log('Drag-Drop of ToDo has occured.');
        const fn = this.calService.getTodo(droppedEvent.id);
        if (fn.found && fn.todo) {
          // console.log('Found Todo: ' + fn.found);
          const todo = fn.todo;
          //todo.startDate = new Date(droppedEvent.startStr);                  //////////////Hello////////////////////
          //todo.endDate = new Date(droppedEvent.endStr);                     //////////////Hello////////////////////
          // this.calService.updateTodo(todo);
          // updated = true;
        }
    }
    return updated;
  }

  // Gets/Sets events of specified date
  private getSelectedDaysEvents(date: Date): void {
    const dt = date;

    this.selectedDayEvents = [];

    let e =  this.currentEvents.filter(c => c.start?.getFullYear === dt.getFullYear);
    e = e.filter(c => c.start?.getMonth() === dt.getMonth() );

    e.forEach((event) => {
      if (event._instance) {
        if (event._instance?.range.start.getDate() + 1 === dt.getDate()) {
          this.selectedDayEvents.push(event);
        }
        else if (
          event._instance.range.end.getDate() >= dt.getDate() &&
          event._instance?.range.start.getDate() + 1 < dt.getDate() )
        {
          this.selectedDayEvents.push(event);
        }
      }
    });
  }

  openNoteDialog(n: Note): void {
    const dlgConfig = this.getDialogConfig();
    dlgConfig.data = {
      note: n,
    };

    // Want to open from Top Left - Close Slide down
    // https://material.angularjs.org/1.1.2/demo/dialog

    const dlgRef = this.dialog.open(ViewNoteComponent, dlgConfig);
    dlgRef
      .afterClosed()
      .subscribe((data) => {
        if (data === 'edit') {
          // Navigate to Note-Edit passing note.id
          const url = '/editNote/' + n.id;
          this.router.navigate([url ] );
        }
      });

    return;
  }

  openTodoDialog(t: ToDo): void {
    const dlgConfig = this.getDialogConfig();
    dlgConfig.data = {
      todo: t,
    };

    const dlgRef = this.dialog.open(ViewTodoComponent, dlgConfig);
    dlgRef.afterClosed()
    .subscribe((data) => {
      if (data === 'edit') {
        // Navigate to Todo-Edit passing todo.id
        alert('Navigate to Todo-Edit passing todo.id');
      }
    });

    return;
  }

  private getDialogConfig(): MatDialogConfig {
    const dlgConfig = new MatDialogConfig();
    dlgConfig.disableClose = true;
    dlgConfig.autoFocus = false;
    dlgConfig.role = 'dialog';

    return dlgConfig;
  }

  constructor(private calService: CalendarService,
              private cd: ChangeDetectorRef,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    // Fetch all data & populate in the Calendar
    this.getDataAsEvents();

  }

  private initCalendarOptions(): void {
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      initialView: 'dayGridMonth',
      weekends: this.showWeekends,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      timeZone: 'local',
      eventSources: [
        {
          events: this.noteEvents,
          color: this.preference.highPriorityNoteColor,
          textColor: 'white',
          borderColor: 'red',
        },
        {
          events: [
            {
              title: '422 Meeting',
              start: '2021-11-06T21:26:48.703Z',
              end: '2021-11-06T08:00:00.000Z',
              id: '2',
              interactive: true,
            },
            {
              title: 'ASC',
              start: '2021-11-05T21:26:48.703Z',
              end: '2021-11-06T21:26:48.703Z',
              editable: true,
            },
          ],
          // backgroundColor: 'gray',
          color: this.preference.mediumPriorityNoteColor,
          textColor: 'black',
          borderColor: 'green',
          editable: true,
        },
        {
          events: this.getEvents(),
          color: this.preference.lowPriorityNoteColor,
          textColor: 'black',
        },
        {
          events: this.todoEvents,
          color: this.preference.todoColor,
          borderColor: 'blue',
        },
      ],
      select: this.handleDateSelect.bind(this),
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventDidMount: this.handleDidMountEvent.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      eventDisplay: 'block',
      eventInteractive: true,
    };

    return;
  }

  async getDataAsEvents(): Promise<void> {
    this.noteEvents = await this.calService.getNoteEvents().toPromise();
    this.todoEvents = await this.calService.getToDosOfMonthAsEvents(11);
    // console.log('Received ToDo ' + this.todoEvents.length + ' Received Notes: ' + this.noteEvents.length);

    this.initCalendarOptions();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.dialog.ngOnDestroy();
  }

  getEvents(): EventInput[] {
    const event: EventInput[] = [];
    event.push({
      title: 'Sp. Note 1',
      start: '2021-11-05T21:26:48.703Z',
      end: '2021-11-06T21:26:48.703Z',
    });
    event.push({
      title: 'Sp. Note 2',
      start: '2021-11-02T21:26:48.703Z',
      end: '2021-11-04T21:26:48.703Z',
      interactive: true,
    });
    event.push({
      title: 'Sp. Note 3',
      start: '2021-11-03T21:26:48.703Z',
      end: '2021-11-03T21:26:48.703Z',
    });

    return event;
  }
}
