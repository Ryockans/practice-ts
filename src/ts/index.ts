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

  mode: "Multiple item",
  parameters: {
    animationTime: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    isLooped: true,
  }

});

slider.init()