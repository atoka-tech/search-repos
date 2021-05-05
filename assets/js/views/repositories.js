const emphasize = (str, q) => {
  const queries = q.split(" ").filter((query) => !query.includes(":"));
  const regex = new RegExp(`(${queries.join("|")})`, "gi");

  if (!str) return "";

  return str.replace(regex, "<strong>$1</strong>");
};

const $li = ({
  htmlUrl,
  fullName,
  description,
  language,
  stargazersCount,
  updatedAt,
}) => `
<li>
  <a href="${htmlUrl}" target="_blank">
    <div class="full-name">${fullName}</div>
    <div class="desc">${description}</div>
    <div class="spec">
      <div class="lang">${language}</div>
      <div class="stars">${stargazersCount}</div>
      <div class="updated-at">Update on ${updatedAt}</div>
    </div>
  </a>
</li>`;

export const repositoriesView = ({ el, items, q }) => {
  const $el = document.querySelector(el);
  const $ul = document.createElement("ul");

  for (const item of items) {
    $ul.insertAdjacentHTML(
      "beforeend",
      $li({
        htmlUrl: item.html_url,
        fullName: emphasize(item.full_name, q),
        description: emphasize(item.description, q),
        language: item.language,
        stargazersCount: item.stargazers_count,
        updatedAt: item.updated_at,
      })
    );
  }

  $el.innerHTML = null;
  $el.append($ul);
};
