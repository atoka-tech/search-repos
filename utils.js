export const throttle = (callback, waitTime) => {
  let timeout, prevCallTime;

  return (...args) => {
    const now = performance.now();
    const diff = now - (prevCallTime || now);

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    if (!prevCallTime) {
      prevCallTime = performance.now();
    }

    if (diff > waitTime) {
      callback(...args);
    } else {
      timeout = setTimeout(() => {
        prevCallTime = null;
        callback(...args);
      }, waitTime - diff);
    }
  };
};

export const getRepositories = async (keyword) => {
  if (!keyword) return [];

  const params = new URLSearchParams();

  params.set("q", keyword);

  return await fetch(
    "https://api.github.com/search/repositories?" + params.toString()
  )
    .then(async (res) => {
      const json = await res.json();

      if (res.ok) return json;

      if (json.message && typeof json.message === "string") {
        throw new Error(json.message);
      } else {
        throw new Error("Something went wrong.");
      }
    })
    .then((json) => json.items);
};
