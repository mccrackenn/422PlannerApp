export interface ToDoItem {
    id: number;
    title: string;
    createdDate: Date;
    startDate: Date;
    endDate: Date;
    listOfItems: ToDoItem[];
}