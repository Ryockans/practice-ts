import {Slider, Selectors} from "./types";

export class MySlider implements Slider {
  selectors: Selectors;
  slider: HTMLElement;
  display: HTMLElement;
  slides: HTMLElement[];
  buttonNext: HTMLElement;
  buttonPrevious: HTMLElement;
  dotButtonsContainer: HTMLElement;
  switchButtons: HTMLElement[];
  currentSlideIndex: number;

  constructor(selectors: Selectors) {
    this.selectors = selectors;
    this.display = document.querySelector(selectors.display);
    this.slider = document.querySelector(selectors.slider);
    this.slides = Array.from(document.querySelectorAll(selectors.slides));
    this.buttonNext = document.querySelector(selectors.buttonNext);
    this.buttonPrevious = document.querySelector(selectors.buttonPrevious);
    this.dotButtonsContainer = document.querySelector(selectors.dotButtonsContainer);
    this.switchButtons = [] as HTMLElement[];
  }

  init() {
    this.buttonNext.addEventListener('click', () => this.nextSlide());
    this.buttonPrevious.addEventListener('click', () => this.previousSlide());

    const slideNumber = this.slides.length;

    for (let i = 0; i < slideNumber; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      this.switchButtons.push(dot);
      this.dotButtonsContainer.append(dot);
    }

    this.switchButtons[0].classList.add('-active');
    this.currentSlideIndex = 0;

    this.dotButtonsContainer.addEventListener('click', (event) => {
      const isSwitchClick: boolean = this.switchButtons.includes(event.target as HTMLElement);

      if (!isSwitchClick) return;

      const slideIndex = this.findSlideIndex(event.target);
      this.switchToSlide(slideIndex);
    });
  }

  get lastSlideIndex() {
    return this.slides.length - 1;
  }

  private forbidButtonsClick(ms) {
    this.buttonNext.setAttribute('disabled', '');
    this.buttonPrevious.setAttribute('disabled', '');

    setTimeout(() => {
      this.buttonNext.removeAttribute('disabled');
      this.buttonPrevious.removeAttribute('disabled');
    }, ms)
  }

  shift(slideIndex: number, delay: number = 500) {
    console.dir(slideIndex);

    this.forbidButtonsClick(delay);

    const firstSlideCoords = this.slides[0].getBoundingClientRect()
    const targetSlide = this.slides[slideIndex];
    const targetRect = targetSlide.getBoundingClientRect();
    const style = this.slider.style;
    const shift = firstSlideCoords.left - targetRect.left;

    style.transform = `translate(${shift}px)`;
  }

  loopSlider(isForward: Boolean) {
    let surrogate: HTMLElement;
    const delay = 10;
    const style = this.slider.style;

    if (isForward) {
      surrogate = this.slides[0].cloneNode(true) as HTMLElement;

      this.slider.append(surrogate);
      this.slides.push(surrogate);
      this.shift(this.lastSlideIndex);

      setTimeout(() => {
        style.transition = 'none';
        this.shift(0, delay);

        setTimeout(() => {
          style.transition = 'transform 500ms';
        }, delay);

        surrogate.remove();
        this.slides.pop();
      }, 500);

    } else {
      surrogate = this.slides[this.lastSlideIndex].cloneNode(true) as HTMLElement;

        setTimeout(() => {
            this.slider.prepend(surrogate);
            this.slides.push(surrogate);
            style.transition = 'none';
            this.shift(1, delay);

            setTimeout(() => {
                style.transition = 'transform 500ms';
                this.shift(0);

                setTimeout(() => {

                    style.transition = 'none';
                    this.shift(this.lastSlideIndex - 1, delay);

                    setTimeout(() => {
                        style.transition = 'transform 500ms';
                    }, delay);

                    surrogate.remove();
                    this.slides.pop();
                }, 500);
            }, delay);
        }, 0)
    }
  }

  changeActiveButton(index: number) {
    const lastSlideIndex = this.slides.length - 1;

    if (index > lastSlideIndex) index = 0;
    if (index < 0) index = lastSlideIndex;

    this.switchButtons[this.currentSlideIndex].classList.remove('-active');
    this.switchButtons[index].classList.add('-active');
    this.currentSlideIndex = index;
  }

  findSlideIndex(sliderSwitch) {
    return this.switchButtons.indexOf(sliderSwitch);
  }

  nextSlide() {
    const lastSlideIndex = this.slides.length - 1;
    const oldIndex = this.currentSlideIndex;

    this.changeActiveButton(this.currentSlideIndex + 1);

    if (this.currentSlideIndex - oldIndex === -lastSlideIndex) {
      this.loopSlider(true)
      return;
    }

    this.shift(this.currentSlideIndex);
  }

  previousSlide() {
    const lastSlideIndex = this.slides.length - 1;
    const oldIndex = this.currentSlideIndex;

    this.changeActiveButton(this.currentSlideIndex - 1);


    if (this.currentSlideIndex - oldIndex === lastSlideIndex) {
      this.loopSlider(false)
      return
    }

    this.shift(this.currentSlideIndex);
  }

  switchToSlide(slideIndex) {
    this.changeActiveButton(slideIndex);
    this.shift(slideIndex);
  }
}