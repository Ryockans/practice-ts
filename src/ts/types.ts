export interface Slider {
  init(): void;

  recalculate(): void;

  shift(slideIndex: number, ms: number): void;

  loopSlider(isForward: Boolean): void;

  findSlideIndex(sliderSwitch: HTMLElement): number;

  nextSlide(): void;

  previousSlide(): void;

  switchToSlide(slideIndex: number): void;
}

export type Mode = 'Single item' | 'Multiple item'

export type Parameters = {
  animationTime: number, //ms
  slidesToShow?: number,
  slidesToScroll?: number,
  isLooped: boolean,
}

export type ResponsiveParameters = Parameters & {breakpoint: number}

export type Options = {
  selectors: {
    slider: string;
    display: string;
    slides: string;
    buttonNext: string;
    buttonPrevious: string;
    dotButtonsContainer: string;
  },
  mode: Mode,
  parameters: Parameters,
  responsive?: ResponsiveParameters[];
}

