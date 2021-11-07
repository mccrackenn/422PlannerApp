import { ToDoItem } from './toDoItem';

export class ToDo {
    id: number;
    todoTitle: string;
    createdDate: Date;
    listOfItems: ToDoItem[];

    constructor(title?: string) {
        this.id = -1;
        if (title) {
            this.todoTitle = title;
        } else {
            this.todoTitle = 'Untitled ToDo';
        }
        this.createdDate = new Date();
        this.listOfItems = new Array<ToDoItem>();
    }

}
