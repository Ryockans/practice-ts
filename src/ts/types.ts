export interface Slider {
  init(): void;

  recalculate(): void;

  shift(slideIndex: number, forLoop: boolean, ms: number): void;

  setSliderParameters();

  loopStartToEnd(): void;

  loopEndToStart(): void;

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
  autoplay?: true,
  autoplayInterval?: number //ms
}

export type ResponsiveParameters = {
  breakpoint: number;
  parameters: Parameters;
}

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
  eventsAndHandlers?: {
    event: SliderEvents,
    callback: (...args: unknown[] | undefined) => void
  }[]
}


export enum SliderEvents {
  Change = 'slide:change',
  End = 'slider:end',
  Loop = 'slider:loop'
}
