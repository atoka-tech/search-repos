export const messageView = ({ el, message }) => {
  const $el = document.querySelector(el);

  $el.innerHTML = null;
  $el.append(`${message}`);
};
