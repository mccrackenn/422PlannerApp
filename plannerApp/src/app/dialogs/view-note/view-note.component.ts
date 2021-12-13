import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Note } from 'src/app/models/note';

@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.css']
})
export class ViewNoteComponent implements OnInit {

  note: Note;

  constructor(private dlgRef: MatDialogRef<ViewNoteComponent>,
              @Inject(MAT_DIALOG_DATA) data: any) {
                this.note = data.note;
              }

  ngOnInit(): void {
    this.dlgRef.updateSize();
  }

  edit(): void {
    this.dlgRef.close('edit');
  }

  close(): void {
    this.dlgRef.close();
  }
}
