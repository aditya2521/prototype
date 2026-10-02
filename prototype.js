import { journeys, selectOnboardingRole, getOnboardingRole, onboardingGuidance } from "./src/onboarding.js";

const state = {
  screen: "landing",
  panel: "dashboard",
  onboardingStep: 1,
  isAuthenticated: false,
  pendingPanel: "dashboard",
  comparison: new Set(["Northstar Academy", "Lakeside United"]),
  reviewCategory: "all",
  reviewTarget: "",
  reviewKind: "",
};

const screens = document.querySelectorAll(".screen");
const panels = document.querySelectorAll(".app-panel");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const reviewModal = document.getElementById("review-modal");
const reviewEntitySelect = document.getElementById("review-entity-select");
const reviewRelationship = document.getElementById("review-relationship");
const siteHeader = document.querySelector(".site-header");
let toastTimer;

const reviewStories = {
  school: [
    ["Strong support on and off the field", "Academic expectations were clear, the staff communicated early, and the athlete support team followed through."],
    ["A competitive program with useful structure", "Training and college preparation felt organized. Families would benefit from earlier updates when travel plans change."],
  ],
  club: [
    ["Clear development plan and excellent feedback", "The staff explained where my athlete was progressing and where more work was needed. Communication stayed consistent."],
    ["Strong experience; communication can improve", "The experience was challenging in a positive way and the people cared about growth. A few schedule changes arrived late."],
  ],
  professional: [
    ["Advice was specific and actionable", "Sessions focused on real development priorities, with honest feedback and a clear plan for what to work on next."],
    ["Professional, responsive, and transparent", "Expectations, pricing, and next steps were explained up front. Follow-up was reliable throughout the season."],
  ],
  event: [
    ["Well organized and worth the trip", "Check-in, schedules, and field directions were easy to follow. The competition level matched what was advertised."],
    ["Good exposure with a few timing delays", "The event delivered useful competition and coach visibility. More real-time updates would make schedule changes easier."],
  ],
};

function updateReviewRelationships(kind = "") {
  let options = ["Parent / guardian", "Athlete", "Alumni"];
  if (/tournament|league|event/i.test(kind)) options = ["Athlete / participant", "Parent / guardian", "Coach / team staff"];
  if (/coach|trainer|agency|agent/i.test(kind)) options = ["Athlete / client", "Parent / guardian", "Organization partner"];
  reviewRelationship.innerHTML = options.map((label) => `<option>${label}</option>`).join("");
}

function setReviewTarget(name = "", kind = "") {
  state.reviewTarget = name;
  state.reviewKind = kind;
  reviewEntitySelect.value = name;
  document.getElementById("review-title").textContent = name ? `Review ${name}` : "Write a verified review";
  document.getElementById("review-target-kind").textContent = kind || "Choose from every verified entity on Chinstrap.";
  document.getElementById("review-eligibility-target").textContent = name || "the selected entity";
  updateReviewRelationships(kind);
}

function openReviewModal(name = "", kind = "") {
  setReviewTarget(name, kind);
  reviewModal.classList.add("open");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => (name ? reviewModal.querySelector("[data-rating]") : reviewEntitySelect).focus());
}

function closeReviewModal() {
  reviewModal.classList.remove("open");
  document.body.classList.remove("modal-open");
}

function filterReviewEntities() {
  const query = document.getElementById("review-entity-search").value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll("[data-review-card]").forEach((card) => {
    const matchesCategory = state.reviewCategory === "all" || card.dataset.reviewType === state.reviewCategory;
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
    card.hidden = !(matchesCategory && matchesQuery);
    if (!card.hidden) visible += 1;
  });
  document.getElementById("review-empty").classList.toggle("show", visible === 0);
}

function showReviewDetail(card) {
  const name = card.dataset.reviewName;
  const kind = card.querySelector(".tag")?.textContent.replace("Verified ", "") || "Verified entity";
  document.getElementById("review-detail-name").textContent = name;
  document.getElementById("review-detail-kind").textContent = `${kind} · ${card.querySelector("p")?.textContent || "Verified on Chinstrap"}`;
  document.getElementById("review-confidence").textContent = card.dataset.reviewConfidence;
  document.getElementById("review-rating").textContent = card.dataset.reviewRating;
  document.getElementById("review-count").textContent = card.dataset.reviewCount;
  const reviewButton = document.querySelector("#review-detail [data-review-entity]");
  reviewButton.dataset.reviewEntity = name;
  reviewButton.dataset.reviewKind = card.querySelector("[data-review-entity]").dataset.reviewKind;
  reviewButton.textContent = `Review ${name}`;
  const stories = reviewStories[card.dataset.reviewType] || reviewStories.club;
  document.getElementById("review-story-title-one").textContent = stories[0][0];
  document.getElementById("review-story-copy-one").textContent = stories[0][1];
  document.getElementById("review-story-title-two").textContent = stories[1][0];
  document.getElementById("review-story-copy-two").textContent = stories[1][1];
  document.getElementById("review-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateStickyHeader() {
  siteHeader?.classList.toggle("is-scrolled", state.screen === "landing" && window.scrollY > 40);
}

window.addEventListener("scroll", updateStickyHeader, { passive: true });

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
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  updateStickyHeader();
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
  document.getElementById("onboarding-selection").hidden = state.onboardingStep !== 1;
  document.getElementById("progress-fill").style.width = `${(state.onboardingStep / 6) * 100}%`;
  document.getElementById("step-back").style.visibility = state.onboardingStep === 1 ? "hidden" : "visible";
  document.getElementById("step-next").innerHTML = state.onboardingStep === 6
    ? 'Create my workspace <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'
    : 'Continue <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
  const guidance = onboardingGuidance(getOnboardingRole(), state.onboardingStep);
  document.getElementById("onboarding-aside-title").textContent = guidance[0];
  document.getElementById("onboarding-aside-copy").textContent = guidance[1];
  document.querySelectorAll("[data-onboarding-jump]").forEach((button) => {
    const buttonStep = Number(button.dataset.onboardingJump);
    button.classList.toggle("active", buttonStep === state.onboardingStep);
    button.classList.toggle("complete", buttonStep < state.onboardingStep);
    button.setAttribute("aria-current", buttonStep === state.onboardingStep ? "step" : "false");
  });
  document.querySelector(".onboarding__main")?.scrollTo({ top: 0, behavior: "smooth" });
  if (state.screen === "onboarding") {
    window.scrollTo({ top: 0, behavior: "instant" });
    const heading = document.querySelector(".onboarding-step.active h1");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
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
      selectOnboardingRole(screenButton.dataset.role);
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
    selectOnboardingRole(roleChoice.dataset.roleChoice);
    setOnboardingStep(1);
    roleChoice.focus({ preventScroll: true });
  }

  if (event.target.closest("[data-setup-skip]")) setOnboardingStep(state.onboardingStep + 1);

  const onboardingJump = event.target.closest("[data-onboarding-jump]");
  if (onboardingJump) setOnboardingStep(Number(onboardingJump.dataset.onboardingJump));

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

  const reviewCategory = event.target.closest("[data-review-category]");
  if (reviewCategory) {
    state.reviewCategory = reviewCategory.dataset.reviewCategory;
    document.querySelectorAll("[data-review-category]").forEach((button) => button.classList.toggle("active", button === reviewCategory));
    filterReviewEntities();
  }

  const reviewView = event.target.closest("[data-review-view]");
  if (reviewView) showReviewDetail(reviewView.closest("[data-review-card]"));

  const reviewEntity = event.target.closest("[data-review-entity]");
  if (reviewEntity) openReviewModal(reviewEntity.dataset.reviewEntity, reviewEntity.dataset.reviewKind);

  if (event.target.closest("[data-review-open]")) openReviewModal();

  const modalButton = event.target.closest("[data-modal]");
  if (modalButton) openReviewModal("Northstar Academy", "Club program");

  if (event.target.closest("[data-modal-close]")) closeReviewModal();

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
    const journey = journeys[getOnboardingRole()];
    document.querySelector(".nav-profile small").textContent = `${journey.label} · Demo`;
    showToast(`Your ${journey.label.toLowerCase()} setup is ready. Welcome to the demo workspace.`);
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
  if (!state.reviewTarget) {
    reviewEntitySelect.focus();
    showToast("Choose who or what you’re reviewing first.");
    return;
  }
  closeReviewModal();
  showToast(`Review for ${state.reviewTarget} saved. Verification is next.`);
});

document.getElementById("review-entity-search").addEventListener("input", filterReviewEntities);

reviewEntitySelect.addEventListener("change", () => {
  const option = reviewEntitySelect.selectedOptions[0];
  setReviewTarget(reviewEntitySelect.value, option?.dataset.kind || "");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeReviewModal();
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
selectOnboardingRole("parent");
setOnboardingStep(1);
updateComparison();
