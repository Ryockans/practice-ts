import { TodoItem } from './types';

interface TodoItemProps {
  text: string
  tag?: string;

  onDelete?: (item: TodoItem) => void;
  onToggle?: (item: TodoItem) => void;
}

export class MyTodoItem implements TodoItem {
  element: HTMLElement | null = null;
  isCompleted = false
  text: string;

  private onDelete = null;
  private onToggle = null;

  constructor({ text, onToggle, onDelete }: TodoItemProps) {
    this.text = text;
    this.onDelete = onDelete;
    this.onToggle = onToggle;
  }

  getElement() {
    this.createElement();
    this.bindEvents();
    this.initializeState();

    return this.element;
  }

  private createElement() {
    this.element = document.createElement('li');
    this.element.classList.add('task');

    this.element.innerHTML = `
      <label class="task__text">
        <input class="task__checkbox" type="checkbox">
        ${this.text}
      </label>
      <button class="task__delete"></button>
    `;
  }

  private bindEvents() {
    const checkbox = this.element.querySelector('input');
    const button = this.element.querySelector('button');

    checkbox.addEventListener('change', () => {
      this.isCompleted = !this.isCompleted;
      this.onToggle();
    });

    button.addEventListener('click', () => {
      this.onDelete(this)
    });
  }

  private initializeState() {
    const checkbox = this.element.querySelector('input')!;

    checkbox.checked = this.isCompleted;
  }
}
