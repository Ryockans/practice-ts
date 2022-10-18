import {Slider, Options, ResponsiveParameters, Parameters, Mode} from "./types";

export class MySlider implements Slider {
  selectors: Options["selectors"];
  slider: HTMLElement;
  display: HTMLElement;
  slides: HTMLElement[];
  activeSlides: HTMLElement[];
  buttonNext: HTMLElement;
  buttonPrevious: HTMLElement;
  dotButtonsContainer: HTMLElement;
  switchButtons: HTMLElement[];
  mode: Mode;
  parameters: Parameters;
  innateParameters?: Parameters;
  responsive?: ResponsiveParameters[];
  currentSlideIndex: number;
  currentBreakpoint: number | 'max';

  constructor(options: Options) {
    this.selectors = options.selectors;
    this.display = document.querySelector(this.selectors.display);
    this.slider = document.querySelector(this.selectors.slider);
    this.slides = Array.from(document.querySelectorAll(this.selectors.slides));
    this.buttonNext = document.querySelector(this.selectors.buttonNext);
    this.buttonPrevious = document.querySelector(this.selectors.buttonPrevious);
    this.dotButtonsContainer = document.querySelector(this.selectors.dotButtonsContainer);
    this.switchButtons = [];
    this.activeSlides = [];

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
      this.responsive.sort((a, b) => b.breakpoint - a.breakpoint);
      this.innateParameters = this.parameters;
    }
  }

  private get sliderStart() {
    return this.slider.getBoundingClientRect().left;
  }

  get lastSlideIndex() {
    return this.activeSlides.length - 1;
  }

  init() {

    this.errorCheck();

    this.slider.style.transition = `transform ${this.parameters.animationTime}ms`;

    this.currentSlideIndex = 0;

    if (this.responsive !== undefined) this.setSliderParameters();


    this.createDots();

    this.addListeners();
  }

  createDots() {
    const slidesAmount = this.slides.length;
    const limit = Math.ceil((slidesAmount - this.parameters.slidesToShow) / this.parameters.slidesToScroll)

    for (let i = 0; i < slidesAmount; i++) {

      this.slides[i].style.minWidth = `calc((100% - (${this.parameters.slidesToShow} - 1)*20px)/${this.parameters.slidesToShow})`;

      if (i % this.parameters.slidesToScroll === 0 && this.switchButtons.length <= limit) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        this.switchButtons.push(dot);
        this.dotButtonsContainer.append(dot);
        this.activeSlides.push(this.slides[i]);
      }
    }

    this.switchButtons[this.currentSlideIndex].classList.add('-active');
  }

  private clearSlidesAndDots() {
    while (this.activeSlides.length !== 0) this.activeSlides.pop();
    while (this.switchButtons.length !== 0) {
      this.switchButtons[this.switchButtons.length - 1].remove();
      this.switchButtons.pop();
    }
  }

  addListeners() {
    this.buttonNext.addEventListener('click', () => this.nextSlide());
    this.buttonPrevious.addEventListener('click', () => this.previousSlide());

    this.dotButtonsContainer.addEventListener('click', (event) => {
      const isSwitchClick: boolean = this.switchButtons.includes(event.target as HTMLElement);

      if (!isSwitchClick) return;

      const slideIndex = this.findSlideIndex(event.target);
      this.switchToSlide(slideIndex);
    });

    window.addEventListener('resize', () => this.recalculate());
  }

  private errorCheck() {
    const sliderStyle = this.slider.style;

    if (this.parameters.slidesToShow < this.parameters.slidesToScroll) {
      this.slider.innerHTML = 'ERROR! <br> SlidesToShow must be more than SlidesToScroll';
      sliderStyle.backgroundColor = 'red';
      sliderStyle.padding = '10px';
      sliderStyle.width = '100%';
      sliderStyle.height = '200px';
      sliderStyle.fontSize = '22px';
      sliderStyle.fontFamily = '"Comic Sans MS", sans-serif';
      sliderStyle.color = 'white';
      sliderStyle.display = 'flex';
      sliderStyle.justifyContent = 'center';
      sliderStyle.alignItems = 'center';
      sliderStyle.textAlign = 'center';
      throw new Error('SlidesToShow must be more than SlidesToScroll');
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

    if (this.responsive !== undefined) {
      this.clearSlidesAndDots();
      this.setSliderParameters();
      this.createDots()
    }
  }


  setSliderParameters() {
    const breakpoints: number[] = [];
    const windowWidth = document.documentElement.clientWidth;

    for (let parametersSet of this.responsive) {
      breakpoints.push(parametersSet.breakpoint);
    }

    breakpoints.push(0);

    for (let i = 0; i < breakpoints.length - 1; i++) {
      const parametersSet = this.responsive[i].parameters;
      if (i === 0) {
        if (windowWidth > breakpoints[i] && this.currentBreakpoint !== 'max') {
          this.parameters = this.innateParameters;
          this.currentBreakpoint = 'max';
          if (this.currentSlideIndex >= this.activeSlides.length) this.currentSlideIndex = 0;
        }
      }

      if (windowWidth < breakpoints[i] && windowWidth > breakpoints[i + 1] && this.currentBreakpoint !== breakpoints[i]) {
        this.parameters = parametersSet;
        this.currentBreakpoint = breakpoints[i];
        if (this.currentSlideIndex >= this.activeSlides.length) this.currentSlideIndex = 0;
      }

      if (!this.parameters.isLooped) {
        this.toggleButtons(0);
      }
    }
  }


  shift(slideIndex, isLastScreen: boolean = false, delay = this.parameters.animationTime) {
    let targetSlide = this.activeSlides[slideIndex];

    if (this.currentSlideIndex === this.lastSlideIndex) isLastScreen = true;

    if (isLastScreen) {
      if (this.mode === 'Multiple item' && this.slides.length % this.parameters.slidesToShow !== 0) {
        targetSlide = this.slides[this.slides.length - this.parameters.slidesToShow];
      }
    }

    const targetEdge = targetSlide.getBoundingClientRect().left;
    const style = this.slider.style;
    const shift = this.sliderStart - targetEdge;

    this.forbidButtonsClick(delay);
    style.transform = `translate(${shift}px)`;

    if (!this.parameters.isLooped) {
      this.toggleButtons();
    } else {
      if (this.buttonPrevious.classList.contains('-inactive')) this.buttonPrevious.classList.remove('-inactive');
      if (this.buttonNext.classList.contains('-inactive')) this.buttonNext.classList.remove('-inactive');
    }
  }

  loopEndToStart(delay: number = 10): void {
    const slideArray: HTMLElement[] = [];
    const style = this.slider.style;

    for (let i = 0; i < this.parameters.slidesToShow; i++) {
      slideArray.push(this.slides[i].cloneNode(true) as HTMLElement);
    }

    for (let slide of slideArray) {
      this.slider.append(slide);
    }

    this.activeSlides.push(slideArray[0]);

    this.shift(this.lastSlideIndex);

    setTimeout(() => {
      style.transition = 'none';
      this.shift(0, false, delay);

      setTimeout(() => {
        style.transition = `transform ${this.parameters.animationTime}ms`;
      }, delay);

      for (let slide of slideArray) {
        slide.remove();
      }
      this.activeSlides.pop();
    }, this.parameters.animationTime);
  }

  loopStartToEnd(delay: number = 10): void {
    const slideArray: HTMLElement[] = [];
    const style = this.slider.style;

    for (let i = this.slides.length - 1; i > this.slides.length - this.parameters.slidesToShow - 1; i--) {
      slideArray.push(this.slides[i].cloneNode(true) as HTMLElement);
    }

    setTimeout(() => {
      for (let slide of slideArray) {
        this.slider.prepend(slide);
      }
      this.activeSlides.push(slideArray[slideArray.length - 1]);

      style.transition = 'none';
      this.shift(0, false, delay);

      setTimeout(() => {
        style.transition = `transform ${this.parameters.animationTime}ms`;
        style.transform = `translate(0px)`;
        this.forbidButtonsClick(this.parameters.animationTime);
        this.activeSlides.pop();

        setTimeout(() => {
          style.transition = 'none';
          setTimeout(() => {
            style.transition = `transform ${this.parameters.animationTime}ms`;
          }, delay);

          for (let slide of slideArray) {
            slide.remove();
          }
          this.shift(this.lastSlideIndex, true, delay);
        }, this.parameters.animationTime);
      }, delay);
    }, 0)
  }

  changeActiveButton(index: number) {

    if (this.parameters.isLooped) {
      if (index > this.lastSlideIndex) index = 0;
      if (index < 0) index = this.lastSlideIndex;
    } else {
      if (index > this.lastSlideIndex) {
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
    const oldIndex = this.currentSlideIndex;

    this.changeActiveButton(this.currentSlideIndex + 1);

    if (this.currentSlideIndex - oldIndex === -this.lastSlideIndex) {
      if (this.parameters.isLooped) {
        this.loopEndToStart();
      }
      return;
    }

    this.shift(this.currentSlideIndex);
  }

  previousSlide() {
    const oldIndex = this.currentSlideIndex;

    this.changeActiveButton(this.currentSlideIndex - 1);

    if (this.currentSlideIndex - oldIndex === this.lastSlideIndex) {
      if (this.parameters.isLooped) {
        this.loopStartToEnd()
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