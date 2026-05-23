// shared/wire-buttons.js — auto-wires common button text patterns to sensible actions.
// Loaded after sidebar.js. Runs once on DOMContentLoaded.

(function () {
  function findNavList() {
    // Helper to find the sidebar list page for this portal
    const portal = document.body.dataset.portal;
    if (!portal) return null;
    // Map current page id back to list page if we're on a create/edit/detail
    const page = document.body.dataset.page || '';
    return null;
  }

  function go(href) { return () => { window.location.href = href; }; }
  function back() { window.history.length > 1 ? window.history.back() : window.location.reload(); }
  function alertAndStay(msg) { alert(msg); }
  function confirmAndGo(prompt, href, successMsg) {
    if (confirm(prompt)) {
      if (successMsg) alert(successMsg);
      if (href) window.location.href = href;
      else window.location.reload();
    }
  }

  // Action map keyed by exact button text (case-insensitive, trimmed)
  const ACTIONS = {
    // --- Cancel / Back ---
    'cancel': () => back(),
    '← back': () => back(),
    'back': () => back(),
    'skip': () => back(),
    'close': () => back(),

    // --- Save / Submit forms ---
    'save changes': () => { alert('✓ Changes saved'); window.location.reload(); },
    'save': () => { alert('✓ Saved'); window.location.reload(); },
    'save draft': () => { alert('✓ Draft saved'); },
    'save & add another': () => { alert('✓ Saved — adding next'); window.location.reload(); },
    'save & exit': () => { alert('✓ Saved'); back(); },
    'save item': () => { alert('✓ Inventory item saved'); },
    'update password': () => { alert('✓ Password updated'); },

    // --- Export / Print / Download ---
    'export': () => alertAndStay('📤 Export started. You\'ll receive an email when ready.'),
    'export csv': () => alertAndStay('📤 CSV export started. Download link will be emailed.'),
    'export excel': () => alertAndStay('📤 Excel export started. Download link will be emailed.'),
    'export pdf': () => alertAndStay('📤 PDF export started. Download link will be emailed.'),
    'export all': () => alertAndStay('📤 Export started.'),
    'download csv': () => alertAndStay('⬇ Download starting…'),
    'download pdf': () => alertAndStay('⬇ Download starting…'),
    'download errors csv': () => alertAndStay('⬇ Error log download starting…'),
    'print': () => window.print(),
    'print invoice': () => window.print(),
    'print labels': () => window.print(),
    'email to buyer': () => alertAndStay('✉ Invoice emailed to buyer.'),

    // --- Filters ---
    'filter': () => alertAndStay('Filter panel — coming up next.'),
    '+ filter': () => alertAndStay('Filter panel — coming up next.'),

    // --- Mark all read ---
    'mark all read': () => { alert('✓ All notifications marked as read.'); window.location.reload(); },

    // --- Approve / Reject (generic) ---
    'approve': () => confirmAndGo('Approve this item?', null, '✓ Approved'),
    'reject': () => confirmAndGo('Reject this item? Provide a reason on the next screen.', null, 'Rejected'),
    'approve selected': () => confirmAndGo('Approve all selected items?', null, '✓ Approved'),
    'reject all': () => confirmAndGo('Reject all selected items?', null, 'Rejected'),
    'bulk approve': () => confirmAndGo('Approve all visible items?', null, '✓ Bulk approval done'),
    'bulk reject': () => confirmAndGo('Reject all visible items?', null, 'Bulk rejection done'),
    'request more info': () => alertAndStay('A message has been sent to the applicant.'),
    'investigate': () => alertAndStay('Investigation case opened. Routed to KYC reviewer.'),

    // --- Auction / Hot Deal actions ---
    'place bid': () => { alert('✓ Bid placed. You\'ll be notified if you\'re outbid.'); window.location.reload(); },
    'extend by 24h': () => { alert('⏱ Auction extended by 24 hours.'); window.location.reload(); },
    'pause auction': () => confirmAndGo('Pause this auction? Existing bids will be preserved.', null, '⏸ Auction paused'),
    'close & award to top bidder': () => confirmAndGo('Close auction and award to top bidder? An order will be generated automatically.', null, '✓ Auction closed and order generated'),
    'close deal': () => confirmAndGo('Close this hot deal? Unsold stock returns to inventory.', null, '✓ Deal closed'),
    'delete permanently': () => confirmAndGo('Permanently delete this deal? This cannot be undone.', null, '✓ Deal deleted'),
    'buy now': () => { alert('✓ Order placed.'); window.location.href = 'orders.html'; },
    'add to cart': () => alertAndStay('✓ Added to cart.'),

    // --- Generic CRUD ---
    'delete': () => confirmAndGo('Delete this item? This cannot be undone.', null, 'Deleted'),
    'delete role': () => confirmAndGo('Delete this role?', null, 'Role deleted'),
    'delete item': () => confirmAndGo('Delete this inventory item?', null, 'Deleted'),
    'archive': () => confirmAndGo('Archive this item? It can be restored later.', null, '📦 Archived'),
    'restore': () => alertAndStay('Restored.'),
    'pause': () => alertAndStay('Paused.'),
    'edit': () => alertAndStay('Edit mode coming on next screen.'),
    'investigate': () => alertAndStay('Routed to KYC reviewer.'),

    // --- Refund / Replacement ---
    'submit request': () => { alert('✓ Replacement / refund request submitted.'); window.location.reload(); },
    'approve replacement': () => confirmAndGo('Approve replacement? A new unit will be dispatched.', null, '✓ Replacement approved'),
    'approve refund': () => confirmAndGo('Approve refund?', null, '✓ Refund approved'),
    'reject refund': () => confirmAndGo('Reject refund? You\'ll need to provide a reason.', null, 'Refund rejected'),
    'approve & process': () => confirmAndGo('Approve refund and process payment?', null, '✓ Refund approved and processing'),
    'mark as paid': () => confirmAndGo('Mark this invoice as paid?', null, '✓ Marked as paid'),
    'authorize payout to garage': () => confirmAndGo('Authorize this payout? Funds will be released within 2 business days.', null, '✓ Payout authorized'),

    // --- Subscription ---
    'manage': () => alertAndStay('Plan management modal — coming up.'),

    // --- Reviews ---
    'submit review': () => { alert('✓ Review submitted. Thanks for your feedback.'); window.location.href = 'orders.html'; },

    // --- Notifications panel ---
    'mark all read': () => { alert('All notifications marked as read.'); window.location.reload(); },

    // --- Onboarding ---
    'continue': () => alertAndStay('Saving progress…'),
    'edit application': () => alertAndStay('Resuming application form…'),

    // --- Misc actions ---
    'connect data': () => alertAndStay('Data source connection wizard — coming up.'),
    'documentation': () => alertAndStay('Opening docs in new tab…'),
    'schedule report': () => alertAndStay('Report scheduling — coming up.'),
    'configure': () => alertAndStay('Configuration screen — coming up.'),
    'send reset link': null, // already handled by form
    'sign out': () => { if (confirm('Sign out from this device?')) alert('Signed out.'); },
    'remove from network': () => confirmAndGo('Remove this garage from your network?', null, '✓ Removed'),
    'send rfq': () => alertAndStay('Compose new RFQ — coming up.'),

    // --- Continue / Submit on auth/onboarding ---
    'log in': null,        // form submit handles it
    'verify & continue': null, // already has href
    'create account & continue': null, // form submit
    'sign in securely': null
  };

  function textOf(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isClickable(el) {
    if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') return true;
    if (el.getAttribute('data-wired')) return true;
    if (el.onclick) return true;
    if (el.getAttribute('onclick')) return true;
    if (el.closest('form') && (el.type === 'submit' || el.tagName === 'BUTTON' && !el.type)) {
      // form button — only treat as wired if form has onsubmit
      const form = el.closest('form');
      if (form && (form.onsubmit || form.getAttribute('onsubmit'))) return true;
    }
    return false;
  }

  function wireAll() {
    const candidates = document.querySelectorAll('button.btn, button.pager__btn, button.icon-btn, button.theme-toggle__pill');
    let wired = 0, skipped = 0;
    candidates.forEach(el => {
      if (isClickable(el)) { skipped++; return; }
      const t = textOf(el);
      // Try exact match first
      let action = ACTIONS[t];
      if (action === undefined) {
        // Try fuzzy: starts-with on common prefixes
        for (const key of Object.keys(ACTIONS)) {
          if (key.endsWith('*')) continue;
          if (t.startsWith(key + ' ') || t === key) { action = ACTIONS[key]; break; }
        }
      }
      // Pattern-based fallback
      if (action === undefined) {
        const portal = document.body.dataset.portal;
        // Known + New / + Add destinations per portal
        const createMap = {
          insurance: {
            'claim': 'claim-create.html',
            'policy': 'policies.html',
            'policy holder': 'policy-holders.html',
            'inventory': 'inventory-add.html',
            'auction': 'auction-create.html',
            'hot deal': 'hot-deal-create.html',
            'user': 'user-management.html',
            'venue': 'partners.html'
          },
          garage: {
            'inventory': 'inventory.html',
            'user': 'user-management.html',
            'branch': 'branches.html',
            'rfq': 'rfq-to-supplier-create.html',
            'auction': 'auction.html',
            'hot deal': 'hot-deals.html'
          },
          supplier: {
            'sku': 'inventory-add.html',
            'part': 'inventory-add.html',
            'inventory': 'inventory-add.html',
            'quotation': 'quotations.html',
            'invoice': 'invoice-list.html',
            'promotion': 'hot-deals.html',
            'hot deal': 'hot-deals.html'
          },
          admin: {
            'user': 'users.html',
            'role': 'roles.html',
            'garage': 'garages.html',
            'supplier': 'suppliers.html',
            'insurer': 'insurers.html',
            'task': 'contact-inquiry.html',
            'category': 'damage-categories.html',
            'node': 'vehicle-hierarchy.html',
            'group': 'feature-groups.html'
          }
        };
        if (/^\+\s*(new|add|create|invite|onboard|upload|import)/i.test(t)) {
          // Extract the noun
          const noun = t.replace(/^\+\s*(new|add|create|invite|onboard|upload|import)\s*/i, '').toLowerCase().trim();
          const map = createMap[portal] || {};
          let dest = null;
          for (const [k, v] of Object.entries(map)) {
            if (noun.includes(k)) { dest = v; break; }
          }
          if (dest) {
            action = () => { window.location.href = dest; };
          } else if (/import|upload/i.test(t)) {
            action = () => { window.location.href = 'csv-import.html'; };
          } else {
            action = () => alertAndStay('Opening create form…');
          }
        } else if (/^send\b/i.test(t)) {
          action = () => alertAndStay('Sending…');
        } else if (/^(generate|raise|create)\b/i.test(t)) {
          action = () => alertAndStay('Processing…');
        } else if (/^(confirm|continue|next|proceed)\b/i.test(t)) {
          action = () => alertAndStay('Proceeding to next step…');
        } else if (/(escalate|open)\b/i.test(t)) {
          action = () => alertAndStay('Opening…');
        } else if (/^view\b/i.test(t)) {
          // View buttons → if the page has order-detail / claim-detail / quotation-detail link nearby, use it
          action = () => alertAndStay('Opening detail view…');
        } else if (/^(start|begin)\b/i.test(t)) {
          action = () => alertAndStay('Starting…');
        } else if (/(renew|upgrade)\b/i.test(t)) {
          action = () => alertAndStay('Upgrade modal — coming up.');
        } else if (/^(quote now|quote)\b/i.test(t)) {
          action = () => { window.location.href = 'quotations.html'; };
        } else if (/^(review|fulfill)\b/i.test(t)) {
          action = () => alertAndStay('Opening detail view…');
        } else if (/^(decline|reject|fail)\b/i.test(t)) {
          action = () => confirmAndGo('Confirm rejection?', null, 'Rejected');
        }
      }
      if (typeof action === 'function') {
        el.addEventListener('click', e => { e.preventDefault(); action(); });
        el.setAttribute('data-wired', 'true');
        wired++;
      } else {
        // Final fallback — non-disruptive alert
        el.addEventListener('click', e => {
          e.preventDefault();
          // Don't show alert for buttons that just contain icons / arrows
          const t2 = textOf(el);
          if (t2.length < 3 || /^[‹›←→↑↓⋯×+−]+$/.test(t2)) return;
          alertAndStay('"' + el.textContent.trim() + '" — not connected in this preview build.');
        });
      }
    });
    // Wire all-purpose icon links (the more cell ⋯)
    document.querySelectorAll('.more').forEach(el => {
      if (!el.onclick && !el.getAttribute('onclick')) {
        el.addEventListener('click', () => alertAndStay('Row actions — coming up.'));
      }
    });

    // Auto-route .id-link anchors with href="#" to portal-specific detail pages
    const portal = document.body.dataset.portal;
    const idLinkMap = {
      insurance: {
        'JKLMN': 'claim-detail.html',
        'EFHG': 'garage-quotations.html',
        'ORD': 'order-details.html',
        'PAY': 'payouts.html',
        'AUC': 'auction-detail.html',
        'HD': 'hot-deal-detail.html',
        'INV': 'inventory-detail.html'
      },
      garage: {
        'JKLMN': 'claim-detail.html',
        'EFHG': 'rfq-to-supplier.html',
        'Q-': 'quotation-detail.html',
        'ORD': 'order-detail.html',
        'AUC': 'auction-detail.html',
        'HD': 'hot-deal-detail.html'
      },
      supplier: {
        'EFHG': 'rfq-detail.html',
        'Q-': 'quotations.html',
        'SO-': 'orders.html',
        'INV': 'invoice-detail.html',
        'REP': 'replacement-detail.html',
        'REF': 'refund-detail.html',
        'AUC': 'auction-detail.html'
      },
      admin: {
        'APP-': 'approval-detail.html',
        'JKLMN': 'claims.html',
        'ORD': 'orders.html',
        'PAY': 'payments.html'
      }
    };
    const mapping = idLinkMap[portal] || {};
    document.querySelectorAll('.id-link').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href !== '#') return;
      const text = (a.textContent || '').trim();
      for (const [prefix, dest] of Object.entries(mapping)) {
        if (text.toUpperCase().startsWith(prefix.toUpperCase())) {
          a.setAttribute('href', dest);
          break;
        }
      }
      // If still no href, prevent default
      if (a.getAttribute('href') === '#' || !a.getAttribute('href')) {
        a.addEventListener('click', e => { e.preventDefault(); alertAndStay('Opening ' + text + ' detail…'); });
      }
    });

    // Wire auth__link anchors with href="#"
    document.querySelectorAll('.auth__link[href="#"]').forEach(a => {
      const t = (a.textContent || '').toLowerCase();
      if (t.includes('forgot')) a.setAttribute('href', 'forgot-password.html');
      else if (t.includes('create account') || t.includes('new to')) a.setAttribute('href', 'register.html');
      else if (t.includes('resend')) {
        a.addEventListener('click', e => { e.preventDefault(); alert('Code resent.'); });
      } else if (t.includes('sms')) {
        a.addEventListener('click', e => { e.preventDefault(); alert('Switched to SMS verification.'); });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireAll);
  } else {
    wireAll();
  }
})();
