const state = {
  screen: "landing",
  panel: "dashboard",
  onboardingStep: 1,
  isAuthenticated: false,
  pendingPanel: "dashboard",
  comparison: new Set(["Northstar Academy", "Lakeside United"]),
};

const screens = document.querySelectorAll(".screen");
const panels = document.querySelectorAll(".app-panel");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const reviewModal = document.getElementById("review-modal");
let toastTimer;

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function showScreen(name, updateHash = true) {
  if (name === "app" && !state.isAuthenticated) {
    name = "login";
    showToast("Sign in to enter your private Chinstrap workspace.");
  }
  state.screen = name;
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === `screen-${name}`);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  if (updateHash) history.pushState(null, "", name === "landing" ? "#home" : `#${name}`);
}

function showPanel(name, updateHash = true) {
  if (!state.isAuthenticated) {
    state.pendingPanel = name;
    showScreen("login", updateHash);
    return;
  }
  state.panel = name;
  showScreen("app", false);
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${name}`);
  });
  document.querySelectorAll(".sidebar-nav [data-panel], .mobile-nav [data-panel]").forEach((button) => {
    button.classList.toggle("active", button.dataset.panel === name);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  if (updateHash) history.pushState(null, "", `#${name}`);
}

function setOnboardingStep(step) {
  state.onboardingStep = Math.max(1, Math.min(6, step));
  document.querySelectorAll(".onboarding-step").forEach((section) => {
    section.classList.toggle("active", Number(section.dataset.step) === state.onboardingStep);
  });
  document.getElementById("step-label").textContent = `Step ${state.onboardingStep} of 6`;
  document.getElementById("progress-fill").style.width = `${(state.onboardingStep / 6) * 100}%`;
  document.getElementById("step-back").style.visibility = state.onboardingStep === 1 ? "hidden" : "visible";
  document.getElementById("step-next").innerHTML = state.onboardingStep === 6
    ? 'Create my workspace <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'
    : 'Continue <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
}

function updateComparison() {
  document.querySelectorAll(".compare-count").forEach((counter) => {
    counter.textContent = state.comparison.size;
  });
  document.querySelectorAll(".check[data-compare]").forEach((button) => {
    const selected = state.comparison.has(button.dataset.compare);
    button.classList.toggle("selected", selected);
    button.innerHTML = selected ? '<i class="fa-solid fa-check" aria-hidden="true"></i>' : "";
    button.setAttribute(
      "aria-label",
      `${selected ? "Remove" : "Add"} ${button.dataset.compare} ${selected ? "from" : "to"} comparison`,
    );
  });
}

function authenticatePrototype() {
  state.isAuthenticated = true;
  const destination = state.pendingPanel || "dashboard";
  state.pendingPanel = "dashboard";
  showPanel(destination);
  showToast("Signed in securely. Welcome back, Jamie.");
}

document.addEventListener("click", (event) => {
  const screenButton = event.target.closest("[data-screen]");
  if (screenButton) {
    if (screenButton.dataset.role) {
      document.querySelectorAll("[data-role-choice]").forEach((choice) => {
        choice.classList.toggle("selected", choice.dataset.roleChoice === screenButton.dataset.role);
      });
    }
    if (screenButton.dataset.stepStart) {
      setOnboardingStep(Number(screenButton.dataset.stepStart));
    } else if (screenButton.dataset.screen === "onboarding") {
      setOnboardingStep(1);
    }
    showScreen(screenButton.dataset.screen);
  }

  const panelButton = event.target.closest("[data-panel]");
  if (panelButton) showPanel(panelButton.dataset.panel);

  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) {
    showScreen("landing", false);
    document.querySelectorAll(".site-nav .nav-pill").forEach((item) => {
      item.classList.toggle("active", item === scrollButton);
    });
    requestAnimationFrame(() => document.getElementById(scrollButton.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }));
  }

  if (event.target.closest("[data-logout]")) {
    state.isAuthenticated = false;
    state.pendingPanel = "dashboard";
    showScreen("landing");
    showToast("You’re signed out. Your private workspace is locked.");
  }

  const demoLogin = event.target.closest("[data-demo-login]");
  if (demoLogin) authenticatePrototype();

  const roleChoice = event.target.closest("[data-role-choice]");
  if (roleChoice) {
    document.querySelectorAll("[data-role-choice]").forEach((choice) => {
      choice.classList.toggle("selected", choice === roleChoice);
    });
  }

  const interest = event.target.closest(".interest-grid button");
  if (interest) interest.classList.toggle("selected");

  const switchButton = event.target.closest(".switch");
  if (switchButton) switchButton.classList.toggle("on");

  const verificationMethod = event.target.closest("[data-verification-method]");
  if (verificationMethod) {
    document.querySelectorAll("[data-verification-method]").forEach((button) => button.classList.toggle("active", button === verificationMethod));
    document.querySelectorAll("[data-verification-content]").forEach((content) => content.classList.toggle("active", content.dataset.verificationContent === verificationMethod.dataset.verificationMethod));
  }

  const compareButton = event.target.closest("[data-compare]");
  if (compareButton) {
    const name = compareButton.dataset.compare;
    if (state.comparison.has(name)) state.comparison.delete(name);
    else state.comparison.add(name);
    updateComparison();
    showToast(`${name} ${state.comparison.has(name) ? "added to" : "removed from"} comparison.`);
  }

  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    saveButton.classList.toggle("saved");
    const saved = saveButton.classList.contains("saved");
    const icon = saveButton.querySelector("i");
    if (icon) icon.className = saved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";
    showToast(`${saveButton.dataset.save} ${saved ? "saved" : "removed from saved programs"}.`);
  }

  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) showToast(toastButton.dataset.toast);

  const modalButton = event.target.closest("[data-modal]");
  if (modalButton) {
    reviewModal.classList.add("open");
    reviewModal.querySelector("[data-modal-close]").focus();
  }

  if (event.target.closest("[data-modal-close]")) reviewModal.classList.remove("open");

  const ratingButton = event.target.closest("[data-rating]");
  if (ratingButton) {
    const rating = Number(ratingButton.dataset.rating);
    document.querySelectorAll("[data-rating]").forEach((button) => {
      button.classList.toggle("selected", Number(button.dataset.rating) <= rating);
    });
  }

  const filter = event.target.closest(".filters .pill, .review-filters .pill");
  if (filter) {
    filter.parentElement.querySelectorAll(".pill").forEach((pill) => pill.classList.remove("active"));
    filter.classList.add("active");
    showToast(`Filter updated: ${filter.textContent.trim()}`);
  }

  const socialTab = event.target.closest("[data-social-tab]");
  if (socialTab) {
    socialTab.parentElement.querySelectorAll("[data-social-tab]").forEach((button) => button.classList.remove("active"));
    socialTab.classList.add("active");
    showToast(`${socialTab.textContent.trim()} feed selected.`);
  }

  const socialLike = event.target.closest("[data-social-like]");
  if (socialLike) {
    const liked = socialLike.classList.toggle("liked");
    const icon = socialLike.querySelector("i");
    const label = socialLike.querySelector("span");
    if (icon) icon.className = liked ? "fa-solid fa-heart" : "fa-regular fa-heart";
    if (label) label.textContent = liked ? "Liked" : "Like";
    showToast(liked ? "Added to your reactions." : "Reaction removed.");
  }

  const followButton = event.target.closest("[data-follow]");
  if (followButton) {
    const following = followButton.classList.toggle("following");
    followButton.textContent = following ? "Following" : "Follow";
    showToast(following ? "Added to your sports network." : "Removed from your sports network.");
  }

  if (event.target.closest("[data-composer-focus]")) {
    document.getElementById("community-post-input").focus();
  }
});

document.getElementById("step-next").addEventListener("click", () => {
  if (state.onboardingStep < 6) setOnboardingStep(state.onboardingStep + 1);
  else {
    state.isAuthenticated = true;
    state.pendingPanel = "dashboard";
    showPanel("dashboard");
    showToast("Welcome to Chinstrap — your private workspace is ready.");
  }
});

document.getElementById("step-back").addEventListener("click", () => {
  setOnboardingStep(state.onboardingStep - 1);
});

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");
  if (!email.value.trim() || !password.value.trim()) {
    showToast("Enter an email and password to continue.");
    return;
  }
  authenticatePrototype();
});

document.getElementById("toggle-password").addEventListener("click", (event) => {
  const input = document.getElementById("login-password");
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  event.currentTarget.innerHTML = showing ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
  event.currentTarget.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

document.getElementById("landing-search").addEventListener("submit", (event) => {
  event.preventDefault();
  showPanel("discover");
});

document.getElementById("app-search").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("24 verified programs found near Chicago.");
});

document.getElementById("community-post-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("community-post-input");
  if (!input.value.trim()) {
    input.focus();
    showToast("Write a short update first.");
    return;
  }
  input.value = "";
  showToast("Update shared with your community.");
});

document.getElementById("message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  if (!input.value.trim()) return;
  const message = document.createElement("p");
  message.className = "mine";
  message.textContent = input.value.trim();
  document.querySelector(".message-list").appendChild(message);
  input.value = "";
  showToast("Message sent to Northstar Admissions.");
});

document.getElementById("review-submit").addEventListener("click", () => {
  reviewModal.classList.remove("open");
  showToast("Review draft saved. Verification is the next step.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") reviewModal.classList.remove("open");
});

window.addEventListener("popstate", () => {
  const route = location.hash.replace("#", "") || "home";
  if (route === "home") showScreen("landing", false);
  else if (route === "login") showScreen("login", false);
  else if (route === "onboarding") showScreen("onboarding", false);
  else showPanel(document.getElementById(`panel-${route}`) ? route : "dashboard", false);
});

const initialRoute = location.hash.replace("#", "") || "home";
if (initialRoute === "home") showScreen("landing", false);
else if (initialRoute === "login") showScreen("login", false);
else if (initialRoute === "onboarding") showScreen("onboarding", false);
else showPanel(document.getElementById(`panel-${initialRoute}`) ? initialRoute : "dashboard", false);
setOnboardingStep(1);
updateComparison();
