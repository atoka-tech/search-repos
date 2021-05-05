import { throttle, getRepositories, Reactive } from "./utils.js";
import {
  paginateView,
  messageView,
  repositoriesView,
  appView,
  sortView,
} from "./views/index.js";

const reactive = new Reactive({
  initialized: false,
  isLoading: false,
  sort: "",
  perPage: 30,
  total: 0,
  currentPage: 1,
  q: "",
  message: "",
  items: [],
});

reactive.computed((props) => {
  paginateView({
    el: ".paginate",
    perPage: props.perPage,
    total: props.total,
    currentPage: props.currentPage,
    onClick: async (page) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      props.currentPage = page;
      props.isLoading = true;
      await fetch(props.query);
    },
  });
});

reactive.computed((props) => {
  repositoriesView({
    el: ".repositories",
    items: props.items,
    q: props.q,
  });
});

reactive.computed((props) => {
  messageView({
    el: ".message",
    message: props.message,
  });
});

reactive.computed((props) => {
  appView({
    el: ".app",
    isLoading: props.isLoading,
    initialized: props.initialized,
  });
});

reactive.computed((props) => {
  sortView({
    el: ".sort",
    sort: props.sort,
    items: props.items,
    onChange: async (value) => {
      props.sort = value;
      props.currentPage = 1;
      props.isLoading = true;
      await fetch(props.query);
    },
  });
});

const fetch = async () => {
  const res = await getRepositories({
    q: reactive.props.q,
    page: reactive.props.currentPage,
    per_page: reactive.props.perPage,
    sort: reactive.props.sort,
  }).catch((e) => e.message);

  reactive.props.initialized = true;
  reactive.props.isLoading = false;

  if (typeof res === "string") {
    reactive.props.message = res;
    reactive.props.items = [];
    return;
  }

  if (!res.items.length) {
    reactive.props.message = "No results found.";
  } else {
    reactive.props.message = `${Number(
      res.total_count
    ).toLocaleString()} results`;
  }

  reactive.props.items = res.items;
  reactive.props.total = res.total_count || 0;
};

const throttled = throttle(fetch, 1000); // throttle time = 1000ms

document.querySelector("input").addEventListener("input", (e) => {
  const input = e.target.value;

  reactive.props.isLoading = true;
  reactive.props.q = input;
  reactive.props.currentPage = 1;

  throttled(input);
});
