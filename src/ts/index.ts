import {MySlider} from "./slider";

const slider = new MySlider({
  selectors: {
    slider: '.slider',
    display: '.slider__display',
    slides: '.slider__item',
    buttonNext: '.slider__button.-next',
    buttonPrevious: '.slider__button.-previous',
    dotButtonsContainer: '.slider__dots',
  },

  mode: "Single item",
  parameters: {
    animationTime: 500,
    isLooped: true
  }

});

slider.init()