  import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { LoginComponent } from './login/login.component';
import { NotesComponent } from './notes/notes.component';
import { ToDosComponent } from './to-dos/to-dos.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'notes',component:NotesComponent},

  {path:'create-note/:noteId',component:CreateNoteComponent}



  {path:'to-dos',component:ToDosComponent}

  //Add More Routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
