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
    slidesToShow: 4,
    slidesToScroll: 2,
    isLooped: true,
  },

  responsive: [
    {
      breakpoint: 1200,
      parameters: {
        animationTime: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        isLooped: true,
      }
    },
    {
      breakpoint: 1024,
      parameters: {
        animationTime: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        isLooped: false,
      }
    },
    {
      breakpoint: 768,
      parameters: {
        animationTime: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        isLooped: true,
      }
    }
  ]

});

slider.init()