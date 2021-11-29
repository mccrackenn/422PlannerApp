import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateToDoComponent } from './create-todo.component';

describe('CreateNoteComponent', () => {
  let component: CreateToDoComponent;
  let fixture: ComponentFixture<CreateToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateToDoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});