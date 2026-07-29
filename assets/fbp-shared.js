(function () {
  const VERSION = "v4"; // 🔁 change this when you update CSS/JS
  const storageKey = "fbp-theme";

  function bust(url) {
    return url.split("?")[0] + "?v=" + VERSION;
  }

  // 🔄 Cache bust CSS automatically
  document.querySelectorAll('link[href*="fbp-shared.css"]').forEach(link => {
    link.href = bust(link.href);
  });

  function setTheme(mode) {
    if (mode === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
      mode = "dark";
    }

    localStorage.setItem(storageKey, mode);

    const toggle = document.querySelector("[data-fbp-theme-toggle]");
    if (toggle) {
      toggle.textContent = mode === "light" ? "Dark mode" : "Light mode";
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(storageKey) || "dark";
    setTheme(saved);

    const toggle = document.querySelector("[data-fbp-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        const current = document.body.classList.contains("light-mode") ? "light" : "dark";
        setTheme(current === "light" ? "dark" : "light");
      });
    }
  }

  function injectVersion() {
    const version = document.body.getAttribute("data-fbp-version") || "v1.2";
    const el = document.createElement("div");
    el.className = "fbp-version";
    el.textContent = version;
    document.body.appendChild(el);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    injectVersion();
  });
})();