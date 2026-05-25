/* Shared chat input behavior for assessment Notes panels.
   Looks for any `.aw-notes` container on the page and wires up its sibling
   `.aw-notes__input` so pressing Enter / clicking the send button appends a
   new outgoing bubble. Read-only mock — no persistence. */
(function () {
  const me = { initials: 'GR', name: 'You', role: 'Garage' };

  function fmtTime(d) {
    let h = d.getHours(), m = d.getMinutes();
    const am = h < 12 ? 'AM' : 'PM';
    h = h % 12; if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2,'0')} ${am}`;
  }

  function appendOutgoing(chat, text) {
    if (!text.trim()) return;
    const row = document.createElement('div');
    row.className = 'aw-msg right';
    row.innerHTML = `
      <div class="aw-msg__av">${me.initials}</div>
      <div class="aw-msg__col">
        <div class="aw-msg__meta">
          <span class="aw-msg__name">${me.name}</span>
          <span class="aw-msg__role">${me.role}</span>
          <span class="aw-msg__time">${fmtTime(new Date())}</span>
        </div>
        <div class="aw-msg__body"></div>
      </div>`;
    row.querySelector('.aw-msg__body').textContent = text.trim();
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
  }

  function wire(card) {
    const chat = card.querySelector('.aw-notes');
    const wrap = card.querySelector('.aw-notes__input');
    if (!chat || !wrap) return;
    const input = wrap.querySelector('input');
    const send  = wrap.querySelector('.send');
    if (!input || !send) return;

    const submit = () => {
      const v = input.value;
      if (!v.trim()) return;
      appendOutgoing(chat, v);
      input.value = '';
      input.focus();
    };

    send.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
    });

    // initial scroll to bottom
    requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.aw-card').forEach(card => {
      if (card.querySelector('.aw-notes')) wire(card);
    });
  });
})();
