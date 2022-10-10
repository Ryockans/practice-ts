import { TodoEvents, TodoList, TodoControl, Filter } from './types';

export class TodoApp {
  list: TodoList;
  counter = document.querySelector('.todo-app__counter-number');

  constructor(list: TodoList) {
    this.list = list;

    document.addEventListener(TodoEvents.New, () => {
      this.render();
    })

    document.addEventListener(TodoEvents.Remove, () => {
      this.render();
    })

    document.addEventListener(TodoEvents.Change, () => {
      this.render();
    })

    document.addEventListener(TodoEvents.Create, (event: CustomEvent) => {
      this.addItem(event.detail.text);
    })

    document.addEventListener(TodoEvents.Filter, (event: CustomEvent) => {
      this.changeFilter(event.detail.filter);
    })

    document.addEventListener(TodoEvents.ClearDone, () => {
      this.clearDone();
    })
  }

  render() {
    this.list.render()
    this.renderCounter()
  }

  renderCounter() {
    this.counter.innerHTML = this.list.list.filter((item) => !item.isCompleted).length.toString();
  }

  private addItem(text: string) {
    this.list.addItem(text);
    this.render()
  }

  private changeFilter(filter: Filter) {
    this.list.changeFilter((item) => {
      if (filter === 'active') return !item.isCompleted;

      if (filter === 'completed') return item.isCompleted;

      return true;
    });
  }

  private clearDone() {
    this.list.clearCompleted();
  }
}
