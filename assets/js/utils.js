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

export const getRepositories = async ({ q, page, per_page, sort }) => {
  if (!q) return { items: [] };

  const params = new URLSearchParams();

  params.set("q", q);
  params.set("page", page);
  params.set("per_page", per_page);
  params.set("sort", sort);

  return await fetch(
    "https://api.github.com/search/repositories?" + params.toString()
  ).then(async (res) => {
    const json = await res.json();

    if (res.ok) return json;

    if (json.message && typeof json.message === "string") {
      throw new Error(json.message);
    } else {
      throw new Error("Something went wrong.");
    }
  });
};

export class Reactive {
  constructor(props) {
    this.targetMap = new WeakMap();
    this.data = {};

    this.props = new Proxy(props, {
      get: (target, key, receiver) => {
        this.track(target, key, this.effect);

        return Reflect.get(target, key, receiver);
      },

      set: (target, key, value, receiver) => {
        const oldValue = Reflect.get(target, key, receiver);
        const result = Reflect.set(target, key, value, receiver);

        if (oldValue !== value) {
          this.trigger(target, key);
        }

        return result;
      },
    });
  }

  track(target, key, effect) {
    if (!this.targetMap.has(target)) {
      this.targetMap.set(target, new Map());
    }

    if (!this.targetMap.get(target).has(key)) {
      this.targetMap.get(target).set(key, new Set());
    }

    this.targetMap.get(target).get(key).add(effect);
  }

  trigger(target, key) {
    if (!this.targetMap.has(target)) return;

    const deps = this.targetMap.get(target).get(key);

    if (deps) {
      deps.forEach((effect) => effect());
    }
  }

  computed(effect) {
    this.effect = () => effect(this.props);

    return this.effect();
  }
}
