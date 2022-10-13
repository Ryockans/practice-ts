export interface Slider {
    init(): void;

    recalculate(): void;

    forbidButtonsClick(ms: number): void;

    shift(slideIndex: number, ms: number): void;

    loopSlider(isForward: Boolean) : void;

    findSlideIndex(sliderSwitch: HTMLElement): number;

    nextSlide(): void;

    previousSlide(): void;

    switchToSlide(slideIndex: number): void;
}

export type Selectors = {
    slider: string;
    display:string;
    slides: string;
    buttonNext: string;
    buttonPrevious: string;
    dotButtonsContainer: string;
}
