const magazineData = window.INVITATION_DATA || {};

const $ = (selector, scope = document) => scope.querySelector(selector);
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
  const match = String(magazineData.date?.iso || "").match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
  );
  if (!match) return { monthDay: "" };

  const [, , month, day] = match;
  return { monthDay: `${month}.${day}` };
}

function accountGroups(accounts) {
  if (!Array.isArray(accounts)) return [];

  return accounts
    .map((group) => ({
      side: group.side || "계좌",
      people: (group.people || [group]).filter(
        (person) => person?.bank && person?.number,
      ),
    }))
    .filter((group) => group.people.length > 0);
}

function renderAccounts() {
  const container = $("[data-accounts]");
  if (!container) return;

  accountGroups(magazineData.accounts).forEach((group) => {
    const groupElement = document.createElement("section");
    groupElement.className = "account-group";

    const title = document.createElement("h4");
    title.textContent = group.side;
    groupElement.append(title);

    group.people.forEach((person) => {
      const row = document.createElement("div");
      row.className = "account-row";

      const relation = document.createElement("span");
      relation.textContent = person.relation || "계좌";

      const detail = document.createElement("p");
      const holder = document.createElement("strong");
      holder.textContent = person.holder || "예금주";
      const bank = document.createElement("span");
      bank.textContent = person.bank;
      const number = document.createElement("em");
      number.textContent = person.number;
      detail.append(holder, bank, number);

      row.append(relation, detail);
      groupElement.append(row);
    });

    container.append(groupElement);
  });
}

function renderCoverPhoto() {
  $$("[data-cover-photo]").forEach((frame) => {
    if (!magazineData.cover?.src) {
      frame.classList.add("is-empty");
      return;
    }

    const image = document.createElement("img");
    image.src = magazineData.cover.src;
    image.alt = magazineData.cover.alt || "청첩장 화보 사진";
    image.loading = "eager";
    image.onerror = () => frame.classList.add("is-empty");
    frame.append(image);
  });
}

function renderMagazine() {
  const groom = magazineData.couple?.groom || {};
  const bride = magazineData.couple?.bride || {};
  const venue = magazineData.venue || {};
  const messages = magazineData.messages || {};
  const date = dateParts();

  document.title = `${groom.name || "신랑"} ${bride.name || "신부"} 잡지형 양면 청첩장`;

  setAll("[data-groom-name]", groom.name);
  setAll("[data-bride-name]", bride.name);
  setAll("[data-groom-given]", givenName(groom.name));
  setAll("[data-bride-given]", givenName(bride.name));
  setAll("[data-date-display]", magazineData.date?.display);
  setAll("[data-date-month-day]", date.monthDay);
  setAll("[data-venue-name]", venue.name);
  setAll("[data-venue-floor]", venue.floor);
  setAll("[data-venue-address]", venue.address);
  setAll("[data-quote]", messages.quote);
  setAll("[data-greeting]", messages.greeting);
  setAll("[data-share-url]", magazineData.share?.url);

  renderCoverPhoto();
  renderAccounts();
}

document.querySelector("[data-print-button]")?.addEventListener("click", () => {
  window.print();
});

document.addEventListener("DOMContentLoaded", renderMagazine);
