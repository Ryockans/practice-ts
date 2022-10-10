import { TodoEvents, TodoItem, TodoList, TodoListRenderFilter } from './types';
import { MyTodoItem } from './TodoItem';

export class MyTodoList implements TodoList {
  list: TodoItem[] = []
  element: HTMLElement
  renderFilter = (item: TodoItem) => Boolean(item);

  constructor() {
    this.element = document.querySelector('.todo-app__tasklist')!;
  }

  addItem(text: string) {
    const onDelete = (item: TodoItem) => this.removeTodo(item);
    const onToggle = () => document.dispatchEvent(new Event(TodoEvents.Change));

    const newItem = new MyTodoItem({
      text,
      onDelete,
      onToggle,
    });

    this.list.push(newItem);

    document.dispatchEvent(new Event(TodoEvents.New));
  }

  removeTodo(todoItem: TodoItem) {
    const index = this.list.indexOf(todoItem);

    this.list.splice(index, 1);

    document.dispatchEvent(new Event(TodoEvents.Remove));
  }

  render() {
    this.element.innerHTML = '';

    this.list.filter(this.renderFilter).forEach((listItem) => {
      this.element!.append(listItem.getElement());
    })
  }

  changeFilter(newFilter: TodoListRenderFilter) {
    this.renderFilter = newFilter;
    this.render();
  }

  clearCompleted() {
    this.list.filter((todoItem) => todoItem.isCompleted)
        .forEach((todoItem) => {
          const index = this.list.indexOf(todoItem);
          this.list.splice(index, 1);
        });
    this.render()
  }
}
