import {Slider, Options, ResponsiveParameters, Parameters, Mode} from "./types";

export class MySlider implements Slider {
  selectors: Options["selectors"];
  slider: HTMLElement;
  display: HTMLElement;
  slides: HTMLElement[];
  buttonNext: HTMLElement;
  buttonPrevious: HTMLElement;
  dotButtonsContainer: HTMLElement;
  switchButtons: HTMLElement[];
  mode: Mode;
  parameters: Parameters;
  responsive?: ResponsiveParameters[];
  currentSlideIndex: number;

  constructor(options: Options) {
    this.selectors = options.selectors;
    this.display = document.querySelector(this.selectors.display);
    this.slider = document.querySelector(this.selectors.slider);
    this.slides = Array.from(document.querySelectorAll(this.selectors.slides));
    this.buttonNext = document.querySelector(this.selectors.buttonNext);
    this.buttonPrevious = document.querySelector(this.selectors.buttonPrevious);
    this.dotButtonsContainer = document.querySelector(this.selectors.dotButtonsContainer);
    this.switchButtons = [] as HTMLElement[];

    this.mode = options.mode;
    this.parameters = {
      animationTime: options.parameters.animationTime,
      slidesToShow: options.parameters.slidesToShow,
      slidesToScroll: options.parameters.slidesToScroll,
      isLooped: options.parameters.isLooped,
    };

    if (this.mode === 'Single item') {
      this.parameters.slidesToShow = 1;
      this.parameters.slidesToScroll = 1;
    }

    if (this.mode === 'Multiple item' && options.responsive !== undefined) {
      this.responsive = options.responsive;
    }
  }

  get lastSlideIndex() {
    return this.slides.length - 1;
  }

  init() {
    this.slider.style.transition = `transform ${this.parameters.animationTime}ms`;

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

    window.addEventListener('resize', () => this.recalculate());

    if (!this.parameters.isLooped) {
      this.toggleButtons(0);
    }
  }

  private forbidButtonsClick(ms) {
    this.buttonNext.setAttribute('disabled', '');
    this.buttonPrevious.setAttribute('disabled', '');

    setTimeout(() => {
      this.buttonNext.removeAttribute('disabled');
      this.buttonPrevious.removeAttribute('disabled');
    }, ms)
  }

  private toggleButtons(delay = this.parameters.animationTime) {

    setTimeout(() => {
      if (this.currentSlideIndex === 0) {

        this.buttonPrevious.classList.add('-inactive');
        if (this.buttonNext.classList.contains('-inactive')) this.buttonNext.classList.remove('-inactive');

      } else if (this.currentSlideIndex === this.lastSlideIndex) {

        this.buttonNext.classList.add('-inactive');
        if (this.buttonPrevious.classList.contains('-inactive')) this.buttonPrevious.classList.remove('-inactive');

      } else {
        if (this.buttonPrevious.classList.contains('-inactive')) this.buttonPrevious.classList.remove('-inactive');
        if (this.buttonNext.classList.contains('-inactive')) this.buttonNext.classList.remove('-inactive');
      }
    }, delay)

  }

  recalculate() {
    this.slider.style.transition = 'none';
    this.shift(this.currentSlideIndex);
    setTimeout(() => this.slider.style.transition = `transform ${this.parameters.animationTime}ms`, 0);
  }

  shift(slideIndex: number, delay: number = this.parameters.animationTime) {
    const firstSlideCoords = this.slides[0].getBoundingClientRect()
    const targetSlide = this.slides[slideIndex];
    const targetRect = targetSlide.getBoundingClientRect();
    const style = this.slider.style;
    const shift = firstSlideCoords.left - targetRect.left;

    this.forbidButtonsClick(delay);
    style.transform = `translate(${shift}px)`;

    if (!this.parameters.isLooped) {
      this.toggleButtons();
    }
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
          style.transition = `transform ${this.parameters.animationTime}ms`;
        }, delay);

        surrogate.remove();
        this.slides.pop();
      }, this.parameters.animationTime);

    } else {
      surrogate = this.slides[this.lastSlideIndex].cloneNode(true) as HTMLElement;

      setTimeout(() => {
        this.slider.prepend(surrogate);
        this.slides.push(surrogate);
        style.transition = 'none';
        this.shift(1, delay);

        setTimeout(() => {
          style.transition = `transform ${this.parameters.animationTime}ms`;
          this.shift(0);

          setTimeout(() => {

            style.transition = 'none';
            this.shift(this.lastSlideIndex - 1, delay);

            setTimeout(() => {
              style.transition = `transform ${this.parameters.animationTime}ms`;
            }, delay);

            surrogate.remove();
            this.slides.pop();
          }, this.parameters.animationTime);
        }, delay);
      }, 0)
    }
  }

  changeActiveButton(index: number) {
    const lastSlideIndex = this.slides.length - 1;

    if (this.parameters.isLooped) {
      if (index > lastSlideIndex) index = 0;
      if (index < 0) index = lastSlideIndex;
    } else {
      if (index > lastSlideIndex) {
        return
      }
      if (index < 0) {
        return;
      }
    }

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
      if (this.parameters.isLooped) {
        this.loopSlider(true);
      }
      return;
    }

    this.shift(this.currentSlideIndex);
  }

  previousSlide() {
    const lastSlideIndex = this.slides.length - 1;
    const oldIndex = this.currentSlideIndex;

    this.changeActiveButton(this.currentSlideIndex - 1);


    if (this.currentSlideIndex - oldIndex === lastSlideIndex) {
      if (this.parameters.isLooped) {
        this.loopSlider(false)
      }
      return
    }

    this.shift(this.currentSlideIndex);
  }

  switchToSlide(slideIndex) {
    this.changeActiveButton(slideIndex);
    this.shift(slideIndex);
  }
}