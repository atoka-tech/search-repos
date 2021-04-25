import { throttle, getRepositories } from "./utils.js";

const $app = document.getElementById("app");
const $input = document.querySelector("input");
const $message = document.querySelector(".message");
const $results = document.querySelector(".results");

const renderView = async (keyword) => {
  const res = await getRepositories(keyword).catch((e) => e.message);

  $results.innerHTML = "";
  $message.innerHTML = "";
  $app.classList.remove("is-loading");

  if (!Array.isArray(res)) {
    $message.innerHTML = res;
    return;
  }

  if (!res.length) {
    $message.innerHTML = "No results found.";
    return;
  }

  $message.innerHTML = `Search for: ${keyword}`
  $results.innerHTML = res
    .map(
      (item) =>
        `<li><a href="${item.html_url}" target="_blank">${item.full_name}</a></li>`
    )
    .join("");
};

const throttled = throttle(renderView, 1000); // throttle time = 1000ms

$input.addEventListener("input", (e) => {
  const input = e.target.value;

  $app.classList.add("is-loading");

  throttled(input);
});
