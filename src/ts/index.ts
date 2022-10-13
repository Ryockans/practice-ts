import {MySlider} from "./slider";

const slider = new MySlider({
    slider: '.slider',
    display: '.slider__display',
    slides: '.slider__item',
    buttonNext: '.slider__button.-next',
    buttonPrevious: '.slider__button.-previous',
    dotButtonsContainer: '.slider__dots',
});

slider.init()