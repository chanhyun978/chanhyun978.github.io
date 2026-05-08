const data = window.INVITATION_DATA || {};

const $ = (selector, scope = document) => scope.querySelector(selector);
document.documentElement.classList.add("js-enabled");

function setText(selector, value) {
  const element = $(selector);
  if (element) {
    element.textContent = value || "";
  }
}

function formatTel(phone) {
  return `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
}

function imageWithFallback(src, alt, fallbackText, className) {
  const wrapper = document.createElement("div");
  wrapper.className = className;

  if (!src) {
    wrapper.innerHTML = `<div class="gallery-placeholder">${fallbackText}</div>`;
    return wrapper;
  }

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt || "";
  image.loading = "lazy";
  image.onerror = () => {
    wrapper.innerHTML = `<div class="gallery-placeholder">${fallbackText}</div>`;
  };
  wrapper.append(image);
  return wrapper;
}

function renderCover() {
  const cover = $("[data-cover]");
  if (!cover || !data.cover?.src) return;

  const image = document.createElement("img");
  image.src = data.cover.src;
  image.alt = data.cover.alt || "";
  image.onerror = () => image.remove();
  cover.prepend(image);
}

function renderBasics() {
  const pageTitle = data.share?.title || "모바일 청첩장";
  document.title = pageTitle;
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute("content", pageTitle);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute("content", data.share?.text || "");

  setText("[data-hero-eyebrow]", data.messages?.heroEyebrow);
  setText("[data-hero-title]", data.messages?.heroTitle);
  setText("[data-groom-name]", data.couple?.groom?.name);
  setText("[data-bride-name]", data.couple?.bride?.name);
  setText("[data-date-display]", data.date?.display);
  setText("[data-greeting]", data.messages?.greeting);
  setText("[data-quote]", data.messages?.quote);
  setText("[data-parents-intro]", data.messages?.parentsIntro);
  setText("[data-groom-full-name]", data.couple?.groom?.fullName);
  setText("[data-bride-full-name]", data.couple?.bride?.fullName);
  setText("[data-groom-parents]", data.couple?.groom?.parents);
  setText("[data-bride-parents]", data.couple?.bride?.parents);
  setText("[data-date-heading]", data.date?.display);
  setText("[data-venue-name]", data.venue?.name);
  setText("[data-venue-address]", data.venue?.address);
  setText("[data-venue-floor]", data.venue?.floor);
  setText("[data-venue-transit]", data.venue?.transit);
  setText("[data-venue-parking]", data.venue?.parking);
  setText("[data-venue-capacity]", data.venue?.capacity);
  setText("[data-venue-screen]", data.venue?.screenNote);
  setText("[data-gallery-intro]", data.messages?.galleryIntro);
  setText("[data-account-intro]", data.messages?.accountIntro);

  const groomPhone = $("[data-groom-phone]");
  const bridePhone = $("[data-bride-phone]");
  if (groomPhone) groomPhone.href = formatTel(data.couple?.groom?.phone);
  if (bridePhone) bridePhone.href = formatTel(data.couple?.bride?.phone);
}

function renderCountdown() {
  const eventDate = new Date(data.date?.iso);
  const days = $("[data-days]");
  const hours = $("[data-hours]");
  const minutes = $("[data-minutes]");
  const note = $("[data-countdown-note]");

  if (Number.isNaN(eventDate.getTime())) {
    if (note) note.textContent = "예식 날짜를 invitation-data.js에서 입력해 주세요.";
    return;
  }

  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (diff <= 0) {
    if (days) days.textContent = "0";
    if (hours) hours.textContent = "0";
    if (minutes) minutes.textContent = "0";
    if (note) note.textContent = "소중한 축복에 감사드립니다.";
    return;
  }

  const totalMinutes = Math.floor(diff / 60000);
  const remainingDays = Math.floor(totalMinutes / 1440);
  const remainingHours = Math.floor((totalMinutes % 1440) / 60);
  const remainingMinutes = totalMinutes % 60;

  if (days) days.textContent = String(remainingDays);
  if (hours) hours.textContent = String(remainingHours).padStart(2, "0");
  if (minutes) minutes.textContent = String(remainingMinutes).padStart(2, "0");
  if (note) note.textContent = `예식까지 ${remainingDays}일 남았습니다.`;
}

function renderMapLinks() {
  const container = $("[data-map-actions]");
  if (!container) return;

  const labels = {
    naver: "네이버 지도",
    kakao: "카카오맵",
    google: "구글 지도",
  };

  Object.entries(data.mapLinks || {}).forEach(([key, url]) => {
    if (!url) return;
    const link = document.createElement("a");
    link.className = "button secondary";
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = labels[key] || "지도 보기";
    container.append(link);
  });
}

function renderGallery() {
  const container = $("[data-gallery]");
  if (!container) return;

  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  gallery.forEach((item, index) => {
    container.append(
      imageWithFallback(
        item.src,
        item.alt,
        `사진 ${index + 1}을 교체해 주세요`,
        "gallery-item",
      ),
    );
  });
}

function renderAccounts() {
  const container = $("[data-accounts]");
  if (!container) return;

  (data.accounts || []).forEach((account) => {
    const card = document.createElement("article");
    card.className = "account-card";

    const title = document.createElement("h3");
    title.textContent = `${account.side || ""} ${account.holder || ""}`.trim();

    const button = document.createElement("button");
    button.className = "copy-account";
    button.type = "button";
    button.textContent = "복사";
    button.addEventListener("click", () => {
      copyText(`${account.bank || ""} ${account.number || ""}`.trim());
    });

    const detail = document.createElement("p");
    detail.textContent = `${account.bank || ""} ${account.number || ""}`.trim();

    card.append(title, button, detail);
    container.append(card);
  });
}

function calendarText() {
  return [
    data.date?.calendarTitle || data.share?.title || "Wedding Day",
    data.date?.display || "",
    data.venue?.name || "",
    data.venue?.address || "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("복사되었습니다.");
  } catch {
    showToast("복사를 지원하지 않는 브라우저입니다.");
  }
}

function showToast(message) {
  const toast = $("[data-toast]");
  if (!toast) return;

  toast.textContent = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.textContent = "";
  }, 2400);
}

function shareUrl() {
  return data.share?.url || window.location.href;
}

function bindActions() {
  $("[data-calendar-button]")?.addEventListener("click", () => {
    copyText(calendarText());
  });

  $("[data-copy-link-button]")?.addEventListener("click", () => {
    copyText(shareUrl());
  });

  $("[data-share-button]")?.addEventListener("click", async () => {
    const shareData = {
      title: data.share?.title || document.title,
      text: data.share?.text || "",
      url: shareUrl(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("공유 창을 열었습니다.");
      } catch {
        showToast("공유를 취소했습니다.");
      }
      return;
    }

    copyText(shareData.url);
  });
}

function setAppHeight() {
  const height = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

function setupPager() {
  const shell = $(".page-shell");
  const sections = Array.from(document.querySelectorAll(".section"));
  if (!shell || sections.length === 0) return;

  let activeIndex = 0;
  let wheelLocked = false;
  let touchStartX = 0;
  let touchStartY = 0;

  const dots = document.createElement("nav");
  dots.className = "page-dots";
  dots.setAttribute("aria-label", "청첩장 페이지");

  const dotButtons = sections.map((section, index) => {
    const label = section.querySelector("h1, h2")?.textContent || `페이지 ${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.addEventListener("click", () => setActive(index));
    dots.append(button);
    return button;
  });

  const nextButton = document.createElement("button");
  nextButton.className = "next-page";
  nextButton.type = "button";
  nextButton.addEventListener("click", () => {
    setActive(activeIndex === sections.length - 1 ? 0 : activeIndex + 1);
  });

  shell.append(dots, nextButton);

  function canMoveFromCurrent(direction) {
    const current = sections[activeIndex];
    const maxScrollTop = current.scrollHeight - current.clientHeight;
    if (maxScrollTop <= 4) return true;
    if (direction > 0) return current.scrollTop >= maxScrollTop - 4;
    return current.scrollTop <= 4;
  }

  function setActive(index) {
    activeIndex = Math.max(0, Math.min(index, sections.length - 1));

    sections.forEach((section, sectionIndex) => {
      const isActive = sectionIndex === activeIndex;
      section.classList.toggle("is-active", isActive);
      section.classList.toggle("is-before", sectionIndex < activeIndex);
      section.setAttribute("aria-hidden", String(!isActive));
      if (isActive) {
        section.scrollTop = 0;
      }
    });

    dotButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === activeIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    const isLast = activeIndex === sections.length - 1;
    nextButton.textContent = isLast ? "처음으로" : "다음";
    nextButton.classList.toggle("is-last", isLast);
  }

  function move(direction) {
    if (!canMoveFromCurrent(direction)) return;
    const target = activeIndex + direction;
    if (target < 0 || target >= sections.length) return;
    setActive(target);
  }

  shell.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) < 18) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      if (!canMoveFromCurrent(direction)) return;
      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      move(direction);
      window.setTimeout(() => {
        wheelLocked = false;
      }, 620);
    },
    { passive: false },
  );

  shell.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true },
  );

  shell.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const diffX = touch.clientX - touchStartX;
      const diffY = touch.clientY - touchStartY;
      if (Math.abs(diffY) < 52 || Math.abs(diffY) < Math.abs(diffX)) return;
      move(diffY < 0 ? 1 : -1);
    },
    { passive: true },
  );

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName;
    const isInteractive = activeTag === "A" || activeTag === "BUTTON";
    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      move(1);
    }
    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === " " && !isInteractive) {
      event.preventDefault();
      move(1);
    }
  });

  setActive(0);
}

function init() {
  setAppHeight();
  renderCover();
  renderBasics();
  renderCountdown();
  renderMapLinks();
  renderGallery();
  renderAccounts();
  bindActions();
  setupPager();
  window.setInterval(renderCountdown, 60000);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", setAppHeight);
window.visualViewport?.addEventListener("resize", setAppHeight);
