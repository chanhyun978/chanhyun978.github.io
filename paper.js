const paperData = window.INVITATION_DATA || {};

const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function setAll(selector, value) {
  $$(selector).forEach((element) => {
    element.textContent = value || "";
  });
}

function givenName(name) {
  const value = String(name || "").trim();
  return value.length > 2 ? value.slice(1) : value;
}

function dateParts() {
  const match = String(paperData.date?.iso || "").match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
  );
  if (!match) {
    return { monthDay: "", time: "" };
  }

  const [, year, month, day, hour, minute] = match;
  const weekday = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
    .toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

  return {
    year,
    monthDay: `${month}.${day}`,
    time: `${weekday} · ${hour}:${minute}`,
  };
}

function renderPaperInvitation() {
  const groom = paperData.couple?.groom || {};
  const bride = paperData.couple?.bride || {};
  const venue = paperData.venue || {};
  const messages = paperData.messages || {};
  const date = dateParts();

  document.title = `${groom.name || "신랑"} ${bride.name || "신부"} 종이 청첩장 시안`;

  setAll("[data-paper-title]", messages.heroTitle || "저희 결혼합니다");
  setAll("[data-groom-name]", groom.name);
  setAll("[data-bride-name]", bride.name);
  setAll("[data-groom-given]", givenName(groom.name));
  setAll("[data-bride-given]", givenName(bride.name));
  setAll(
    "[data-couple-mark]",
    `${givenName(groom.name)} · ${givenName(bride.name)}`,
  );
  setAll("[data-groom-full-name]", groom.fullName || groom.name);
  setAll("[data-bride-full-name]", bride.fullName || bride.name);
  setAll("[data-groom-parents]", groom.parents);
  setAll("[data-bride-parents]", bride.parents);
  setAll("[data-date-display]", paperData.date?.display);
  setAll("[data-venue-name]", venue.name);
  setAll("[data-venue-floor]", venue.floor);
  setAll("[data-venue-address]", venue.address);
  setAll("[data-quote]", messages.quote);
  setAll("[data-greeting]", messages.greeting);
  setAll("[data-share-url]", paperData.share?.url);
  setAll("[data-date-year]", date.year);
  setAll("[data-date-month-day]", date.monthDay);
  setAll("[data-editorial-month-day]", date.monthDay);
  setAll("[data-editorial-time]", date.time);

  $$("[data-cover-photo]").forEach((frame) => {
    if (!paperData.cover?.src) return;

    const image = document.createElement("img");
    image.src = paperData.cover.src;
    image.alt = paperData.cover.alt || "청첩장 사진";
    image.loading = "eager";
    image.onerror = () => frame.classList.add("is-empty");
    frame.append(image);
  });
}

document.querySelector("[data-print-button]")?.addEventListener("click", () => {
  window.print();
});

document.addEventListener("DOMContentLoaded", renderPaperInvitation);
