import {TodoEvents, Filter} from './types';

export class TodoControl{
    creator: HTMLElement;
    input: HTMLInputElement;
    filter: NodeListOf<Element>;
    button: HTMLElement;

    constructor() {
        this.creator = document.querySelector('.todo-app__create-task');
        this.input = this.creator.querySelector('input');

        this.creator.addEventListener('submit', (event) => {
            event.preventDefault()

            if (this.input.value === '') return;

            document.dispatchEvent(new CustomEvent(TodoEvents.Create, { detail: { text: this.input.value } }));

            this.input.value = '';
        });

        this.filter = document.querySelectorAll('.todo-app__tab');

        this.filter.forEach((filter) => {
            filter.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                document.dispatchEvent(new CustomEvent(TodoEvents.Filter, { detail: { filter: target.dataset.status } }));
            })
        })

        this.button = document.querySelector('.todo-app__clear');

        this.button.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent(TodoEvents.ClearDone));
        });
    }
}