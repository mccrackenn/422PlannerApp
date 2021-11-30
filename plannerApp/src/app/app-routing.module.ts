import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { LoginComponent } from './login/login.component';
import { NotesComponent } from './notes/notes.component';
import { ToDosComponent } from './to-dos/to-dos.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'edit/:noteId', component: CreateNoteComponent },
  { path: 'to-dos', component: ToDosComponent },
  { path: 'home', component: CalendarComponent },
  { path: 'profile', component: ProfileComponent },

  // Add More Routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
