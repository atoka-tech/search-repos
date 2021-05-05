const SORT = {
  BEST_MACH: {
    query: "",
    label: "Best Match",
  },
  MOST_STARS: {
    query: "stars",
    label: "Most Stars",
  },
  RECENTLY_UPDATED: {
    query: "updated",
    label: "Recently Updated",
  },
};

const $option = ({ value, label, isSelected }) =>
  `<option value="${value}" ${
    isSelected ? 'selected="selected"' : ""
  }>${label}</option>`;

const $label = `<div class="sort-label">Sort:</div>`;

export const sortView = ({ el, items, sort, onChange }) => {
  const $el = document.querySelector(el);
  const $select = document.createElement("select");

  if (!items.length) {
    $el.innerHTML = null;
    return;
  }

  $select.addEventListener("change", (e) => onChange(e.target.value));

  for (const key in SORT) {
    $select.insertAdjacentHTML(
      "beforeend",
      $option({
        value: SORT[key].query,
        label: SORT[key].label,
        isSelected: SORT[key].query === sort,
      })
    );
  }

  $el.innerHTML = null;
  $el.insertAdjacentHTML("afterbegin", $label);
  $el.append($select);
};
