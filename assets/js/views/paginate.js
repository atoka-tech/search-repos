export const paginateView = ({ el, perPage, total, currentPage, onClick }) => {
  const SPREAD = 2;
  const $el = document.querySelector(el);
  const $ul = document.createElement("ul");
  const numOfPages = Math.ceil(Math.min(total, 1000) / perPage);
  const pageNums = [];

  if (total === 0) {
    $el.innerHTML = null;
    return;
  }

  for (let i = currentPage - SPREAD; i <= currentPage + SPREAD; i++) {
    if (i > 1 && i < numOfPages) {
      pageNums.push(i);
    }
  }

  if (pageNums[0] > 2) pageNums.unshift("…");
  if (pageNums[pageNums.length - 1] < numOfPages - 1) pageNums.push("…");

  // NOTE: github apiは1000件までしか返さないので、検索結果が1000件以上の場合はページャーの末番は非表示
  if (numOfPages > 1 && total < 1000) pageNums.push(numOfPages);

  pageNums.unshift(1);

  for (const num of pageNums) {
    const $li = document.createElement("li");
    const $a = document.createElement("a");

    if (num === "…") $li.classList.add("ellipsis");
    if (num === currentPage) $li.classList.add("current");

    $a.innerText = num;
    $a.setAttribute("href", "#");
    $a.addEventListener("click", (e) => {
      e.preventDefault();
      onClick(num);
    });

    $li.append($a);
    $ul.append($li);
  }

  $el.innerHTML = null;
  $el.append($ul);
};
