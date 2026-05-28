(function () {
  const { html, mount, repeat } = window.PaperFramework;
  const { invitation } = window.PaperInvitationData;

  function Toolbar() {
    return html`
      <aside class="toolbar no-print" aria-label="인쇄 도구">
        <div>
          <p class="toolbar__eyebrow">A5 Paper Suite</p>
          <strong>인쇄용 청첩장 원본</strong>
        </div>
        <div class="toolbar__actions">
          <button type="button" data-action="toggle-guides" aria-pressed="false">
            여백선
          </button>
          <button type="button" data-action="print">PDF로 인쇄</button>
        </div>
      </aside>
    `;
  }

  function CoverPage(data) {
    return html`
      <section class="sheet cover-sheet" aria-label="청첩장 표지">
        <img class="cover-sheet__photo" src="${data.image.main}" alt="${data.image.alt}" />
        <div class="cover-sheet__veil"></div>
        <div class="cover-sheet__title">
          <p class="overline">Wedding Invitation</p>
          <h1>
            <span>${data.couple.groom}</span>
            <small>and</small>
            <span>${data.couple.bride}</span>
          </h1>
        </div>
        <div class="cover-sheet__caption">
          <span>${data.couple.english}</span>
          <strong>${data.quote}</strong>
        </div>
        <div class="cover-sheet__date">
          <span>${data.ceremony.date}</span>
          <span>${data.ceremony.day} ${data.ceremony.time}</span>
        </div>
      </section>
    `;
  }

  function DetailRow(label, value, accent = "") {
    return html`
      <div class="detail-row">
        <span>${label}</span>
        <strong>${value}</strong>
        ${accent ? html`<em>${accent}</em>` : ""}
      </div>
    `;
  }

  function QrSlot(qr) {
    return html`
      <figure class="qr-slot" aria-label="${qr.caption}">
        ${qr.image
          ? html`<img src="${qr.image}" alt="${qr.alt}" />`
          : html`<div class="qr-slot__placeholder" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <span>QR</span>
            </div>`}
        <figcaption>${qr.caption}</figcaption>
      </figure>
    `;
  }

  function BackPage(data) {
    return html`
      <section class="sheet back-sheet" aria-label="청첩장 뒷면">
        <div class="safe-frame"></div>
        <header class="back-sheet__header">
          <div>
            <p class="overline">Invitation</p>
            <h2>${data.headline || "서로의 풍경이 되어"}</h2>
          </div>
          ${QrSlot(data.qr)}
        </header>

        <main class="back-sheet__grid">
          <section class="invitation-panel">
            <div class="invitation-panel__message">
              ${repeat(data.message, (line) => html`<p>${line}</p>`)}
            </div>
            <div class="invitation-panel__parents">
              <p>
                ${data.parents.groom.father} · ${data.parents.groom.mother}의 장남
                <strong>${data.couple.groom}</strong>
              </p>
              <p>
                ${data.parents.bride.father} · ${data.parents.bride.mother}의 장녀
                <strong>${data.couple.bride}</strong>
              </p>
            </div>
          </section>

          <section class="ceremony-panel">
            <p class="overline">Ceremony</p>
            <div class="details-panel">
              ${DetailRow("날짜", data.ceremony.displayDate || data.ceremony.date)}
              ${DetailRow("시간", data.ceremony.time)}
              ${DetailRow("장소", data.ceremony.venue, data.ceremony.hall)}
              ${DetailRow("주소", data.ceremony.address)}
            </div>
          </section>
        </main>
      </section>
    `;
  }

  function App() {
    return html`
      ${Toolbar()}
      <main class="preview-stack">
        ${CoverPage(invitation)}
        ${BackPage(invitation)}
      </main>
    `;
  }

  mount("#app", App);

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    if (button.dataset.action === "print") {
      window.print();
    }

    if (button.dataset.action === "toggle-guides") {
      const nextState = !document.body.classList.contains("show-guides");
      document.body.classList.toggle("show-guides", nextState);
      button.setAttribute("aria-pressed", String(nextState));
    }
  });
})();
