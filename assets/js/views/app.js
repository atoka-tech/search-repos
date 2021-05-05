export const appView = ({ el, isLoading, initialized }) => {
  const $el = document.querySelector(el);

  $el.classList.toggle("is-loading", isLoading);
  $el.classList.toggle("initialized", initialized);
};
