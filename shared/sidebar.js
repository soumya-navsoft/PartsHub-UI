// Renders the sidebar for the current portal based on data attributes on <body>.
// <body data-portal="garage" data-page="claim-requests" data-subpage="claim-requests">

window.PHRenderShell = function () {
  const portal = document.body.dataset.portal;
  const page = document.body.dataset.page || '';
  const subpage = document.body.dataset.subpage || '';
  const portalTitle = {
    garage: 'Garage',
    insurance: 'Insurance',
    supplier: 'Supplier',
    admin: 'Admin'
  }[portal] || 'Portal';

  // Sidebar menus per portal — uses expandable submenu groups.
  const NAVS = {
    garage: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: 'dashboard.html' },
      { id: 'claim-request', label: 'RFQs', icon: 'rfq', expandable: true, children: [
        { id: 'claim-requests', label: 'RFQ Request', href: 'claim-requests.html' },
        { id: 'garage-quotations-list', label: 'My Quotations', href: 'quotation-list.html' },
        { id: 'claims-orders', label: 'Claims Orders', href: 'claims-orders.html' }
      ]},
      { id: 'assessments', label: 'Assessments', icon: 'claim', href: 'assessments.html' },
      { id: 'jobs', label: 'Jobs', icon: 'orders', href: 'jobs.html' },
      { id: 'orders', label: 'Orders', icon: 'truck', expandable: true, children: [
        { id: 'rfq-to-supplier', label: 'RFQ To Supplier', href: 'rfq-to-supplier.html' },
        { id: 'supplier-quotations', label: 'Supplier Quotations', href: 'supplier-quotations.html' },
        { id: 'supplier-orders', label: 'Supplier Orders', href: 'supplier-orders.html' }
      ]},
      { id: 'inventory', label: 'Inventory', icon: 'inventory', href: 'inventory.html' },
      { id: 'auction-top', label: 'Auction', icon: 'auction', href: 'auction.html' },
      { id: 'hot-deals-top', label: 'Hot Deals', icon: 'deals', href: 'hot-deals.html' },
      { id: 'store', label: 'Store', icon: 'store', expandable: true, children: [
        { id: 'auction', label: 'Auction', href: 'auction.html' },
        { id: 'hot-deals', label: 'Hot Deals', href: 'hot-deals.html' }
      ]},
      { id: 'subscription', label: 'Subscription', icon: 'sub', href: 'subscription.html' },
      { id: 'user-management', label: 'User Management', icon: 'user', href: 'user-management.html' },
      { id: 'reports', label: 'Reports', icon: 'report', href: 'reports.html' }
    ],
    insurance: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: 'dashboard.html' },
      { id: 'claims', label: 'Claims', icon: 'claim', expandable: true, children: [
        { id: 'claim-requests', label: 'Claim Requests', href: 'claim-requests.html' },
        { id: 'rfq-to-garage', label: 'RFQ To Garage', href: 'rfq-to-garage.html' },
        { id: 'garage-quotations', label: 'Garage Quotations', href: 'garage-quotations-list.html' },
        { id: 'rfq-to-supplier', label: 'RFQ To Supplier', href: 'rfq-to-supplier.html' },
        { id: 'supplier-quotations', label: 'Supplier Quotations', href: 'supplier-quotations-list.html' },
        { id: 'claim-orders', label: 'Claim Orders', href: 'orders.html' },
        { id: 'finalized-claims', label: 'Claim Finalization', href: 'finalized-claims.html' }
      ]},
      { id: 'partners', label: 'Garages', icon: 'garage', href: 'partners.html' },
      { id: 'branches', label: 'Branches', icon: 'branch', href: 'branches.html' },
      { id: 'inventory', label: 'Inventory', icon: 'inventory', href: 'inventory.html' },
      { id: 'auction', label: 'Auction', icon: 'auction', href: 'auction.html' },
      { id: 'hot-deals', label: 'Hot Deals', icon: 'deals', href: 'hot-deals.html' },
      { id: 'subscription', label: 'Subscription', icon: 'sub', href: 'subscription.html' },
      { id: 'venue-master', label: 'Venue Master', icon: 'pin', href: 'venue-master.html' },
      { id: 'user-management', label: 'User Management', icon: 'user', href: 'user-management.html' },
      { id: 'reports', label: 'Reports', icon: 'report', href: 'reports.html' }
    ],
    supplier: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: 'dashboard.html' },
      { id: 'rfqs-group', label: 'RFQs', icon: 'rfq', expandable: true, children: [
        { id: 'rfqs', label: 'RFQ Request', href: 'rfqs.html' },
        { id: 'quotations', label: 'My Quotations', href: 'quotations.html' }
      ]},
      { id: 'orders', label: 'Orders', icon: 'orders', href: 'orders.html' },
      { id: 'store', label: 'Store', icon: 'store', expandable: true, children: [
        { id: 'auction', label: 'Auction', href: 'auction.html' },
        { id: 'hot-deals', label: 'Hot Deals', href: 'hot-deals.html' }
      ]},
      { id: 'subscription', label: 'Subscription', icon: 'sub', href: 'subscription.html' },
      { id: 'user-management', label: 'User Management', icon: 'user', href: 'user-management.html' },
      { id: 'reports', label: 'Reports', icon: 'report', href: 'reports.html' }
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: 'dashboard.html' },
      { id: 'approvals', label: 'Approvals', icon: 'check', href: 'approvals.html', badge: '42' },
      { id: 'insurers', label: 'Insurance Companies', icon: 'shield', href: 'insurers.html' },
      { id: 'garages', label: 'Garages', icon: 'garage', href: 'garages.html' },
      { id: 'suppliers', label: 'Suppliers', icon: 'supplier', href: 'suppliers.html' },
      { id: 'claims', label: 'Claim Requests', icon: 'claim', href: 'claims.html' },
      { id: 'orders', label: 'Orders', icon: 'orders', href: 'orders.html' },
      { id: 'payments', label: 'Payments', icon: 'wallet', href: 'payments.html' },
      { id: 'subscriptions', label: 'Subscriptions', icon: 'sub', href: 'subscriptions.html' },
      { id: 'reviews', label: 'Reviews & Ratings', icon: 'star', href: 'reviews.html' },
      { id: 'users', label: 'Admin Users', icon: 'user', href: 'users.html' },
      { id: 'roles', label: 'Roles & Permissions', icon: 'shield', href: 'roles.html' },
      { id: 'component-menu', label: 'Component Menu', icon: 'component', href: 'component-menu.html' },
      { id: 'vehicle-hierarchy', label: 'Vehicle Hierarchy', icon: 'car', href: 'vehicle-hierarchy.html' },
      { id: 'damage-categories', label: 'Damage Categories', icon: 'tag', href: 'damage-categories.html' },
      { id: 'venue-master', label: 'Venue Master', icon: 'pin', href: 'venue-master.html' },
      { id: 'feature-groups', label: 'Feature Groups', icon: 'grid', href: 'feature-groups.html' },
      { id: 'contact-inquiry', label: 'Contact & Tasks', icon: 'speaker', href: 'contact-inquiry.html' },
      { id: 'reports', label: 'Reports', icon: 'report', href: 'reports.html' },
      { id: 'settings', label: 'Settings', icon: 'settings', href: 'settings.html' }
    ]
  };
  const nav = NAVS[portal] || [];

  const navHtml = nav.map(item => {
    const isActive = page === item.id;
    if (item.expandable) {
      const childrenHtml = item.children.map(c => {
        const active = c.id === subpage ? ' is-active' : '';
        return `<a class="nav-subitem${active}" href="${c.href}">${c.label}</a>`;
      }).join('');
      // Submenus always stay open — no collapse toggle
      return `
        <div class="nav-item nav-item--group${isActive && !subpage ? ' is-active' : ''}">
          <span class="nav-item__icon">${PHIcon(item.icon)}</span>
          <span>${item.label}</span>
          <span class="nav-item__caret">${PHIcon('chevronDown', 16)}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:2px;margin-left:2px;">${childrenHtml}</div>
      `;
    }
    const active = isActive ? ' is-active' : '';
    const badge = item.badge ? `<span class="nav-item__badge">${item.badge}</span>` : '';
    return `<a class="nav-item${active}" href="${item.href}">
      <span class="nav-item__icon">${PHIcon(item.icon)}</span>
      <span>${item.label}</span>${badge}
    </a>`;
  }).join('');

  const sidebar = `
    <aside class="sidebar">
      <div class="sidebar__brand">
        <img src="../shared/main-logo.png" alt="PartsHub" />
      </div>
      <nav class="sidebar__nav">${navHtml}
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--auth-box-border)">
          <a class="nav-item" href="my-account.html"><span class="nav-item__icon">${PHIcon('user')}</span><span>My Account</span></a>
          <a class="nav-item" href="../index.html" onclick="if(!confirm('Sign out of PartsHub?')){event.preventDefault();}"><span class="nav-item__icon" style="color:var(--brand-red)">${PHIcon('logout')}</span><span style="color:var(--brand-red)">Logout</span></a>
        </div>
      </nav>
    </aside>
  `;

  const topbarTitle = document.body.dataset.pageTitle || 'Dashboard';
  const topbar = `
    <header class="topbar">
      <button class="topbar__menu" aria-label="Menu">${PHIcon('menu')}</button>
      <div>
        <h1 class="topbar__title">${topbarTitle}</h1>
      </div>
      <div class="topbar__spacer"></div>
      <div class="topbar__actions">
        <button class="btn-upgrade">Upgrade Now ${PHIcon('chevronRight', 14)}</button>
        <div class="theme-toggle" id="phThemeToggle" style="cursor:pointer" title="Toggle light / dark mode">
          <div class="theme-toggle__pill" id="phThemePill">${PHIcon('sun', 14)}</div>
          <div class="theme-toggle__moon" id="phThemeMoon">${PHIcon('moon', 14)}</div>
        </div>
        <button class="icon-btn" id="phBellBtn">${PHIcon('bell')}<span class="dot"></span></button>
        <div class="avatar" id="phAvatarBtn" style="cursor:pointer" title="Click for account menu"></div>
      </div>
    </header>
  `;

  document.getElementById('shell-sidebar').innerHTML = sidebar;
  document.getElementById('shell-topbar').innerHTML = topbar;

  // Load button wiring script after shell is rendered
  if (!document.getElementById('phWireBtns')) {
    const s = document.createElement('script');
    s.id = 'phWireBtns';
    s.src = '../shared/wire-buttons.js';
    document.body.appendChild(s);
  }

  // Mount notifications panel
  const portalNotifs = {
    garage: [
      { icon: 'claim', title: 'New claim assigned', body: 'Emirates GI sent RFQ EFHG1245F for a Toyota Camry collision.', time: '2 min ago', unread: true },
      { icon: 'quote', title: 'Quotation won', body: 'You won the bid for Claim JKLMN56781. Create the supplier RFQ next.', time: '1 hour ago', unread: true },
      { icon: 'truck', title: 'Parts dispatched', body: 'Gulf Auto Parts shipped 5 parts via DHL · TRK-3024.', time: '3 hours ago', unread: true },
      { icon: 'wallet', title: 'Payment received', body: 'AED 24,854 from Emirates GI for ORD-4500.', time: 'Yesterday' },
      { icon: 'star', title: 'New review', body: 'Mariam Al-Naqbi rated you 5 stars.', time: '2 days ago' }
    ],
    insurance: [
      { icon: 'quote', title: 'Garage quotations received', body: '3 of 3 garages responded to RFQ EFHG1234U.', time: '15 min ago', unread: true },
      { icon: 'claim', title: 'Claim approval needed', body: 'Royal Swiss Automobile submitted quote AED 19,900 — lowest of 3.', time: '1 hour ago', unread: true },
      { icon: 'orders', title: 'Order delivered', body: 'ORD-4498 delivered to Craft Auto Services.', time: '3 hours ago' },
      { icon: 'wallet', title: 'Payout authorised', body: 'AED 18,240 released to Gargash Auto Centre.', time: 'Yesterday' }
    ],
    supplier: [
      { icon: 'rfq', title: 'New RFQ received', body: 'Royal Swiss Automobile invited you to quote 6 parts.', time: '5 min ago', unread: true },
      { icon: 'orders', title: 'Order to ship today', body: 'SO-5212 — Craft Auto Services — pack & dispatch by 4 PM.', time: '1 hour ago', unread: true },
      { icon: 'wallet', title: 'Invoice paid', body: 'Royal Swiss paid INV-7119 (AED 4,720).', time: '4 hours ago' },
      { icon: 'truck', title: 'Replacement request', body: 'Craft Auto raised REP-310 for defective shock absorber.', time: 'Yesterday', unread: true }
    ],
    admin: [
      { icon: 'check', title: 'KYC awaiting review', body: 'Al Wasl Auto Garage submitted application APP-4812.', time: '22h ago', unread: true },
      { icon: 'star', title: 'Review flagged', body: 'Speedway Motors flagged a 1-star review for investigation.', time: '1d ago', unread: true },
      { icon: 'wallet', title: 'Payment failed', body: 'PAY-7617 (Salama → Craft Auto) failed — bank error.', time: '2d ago' },
      { icon: 'user', title: 'New signup', body: 'Falcon Parts Trading registered as a supplier.', time: '3d ago' }
    ]
  };

  const notifs = portalNotifs[portal] || [];
  const unreadCount = notifs.filter(n => n.unread).length;
  const panel = document.createElement('div');
  panel.className = 'notif-panel';
  panel.id = 'phNotifPanel';
  panel.innerHTML = `
    <div class="notif-panel__head">
      <span>${PHIcon('bell', 18)}</span>
      <div class="notif-panel__title">Notifications</div>
      <span class="badge badge--danger" style="margin-left:6px">${unreadCount} new</span>
      <button style="margin-left:auto;background:transparent;border:0;color:var(--ink-400);font-size:12.5px;font-weight:600">Mark all read</button>
    </div>
    <div class="notif-list">
      ${notifs.map(n => `
        <div class="notif-item ${n.unread ? 'is-unread' : ''}">
          <div class="notif-item__icon">${PHIcon(n.icon, 16)}</div>
          <div style="flex:1;min-width:0">
            <div class="notif-item__title">${n.title}</div>
            <div class="notif-item__body">${n.body}</div>
            <div class="notif-item__time">${n.time}</div>
          </div>
        </div>`).join('')}
    </div>
    <div style="padding:12px 18px;border-top:1px solid var(--ink-100);text-align:center">
      <a href="#" style="font-size:13px;font-weight:600;color:var(--brand-red)">View all notifications →</a>
    </div>
  `;
  document.body.appendChild(panel);

  const bell = document.getElementById('phBellBtn');
  if (bell) {
    bell.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.toggle('is-open');
    });
    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && e.target !== bell) panel.classList.remove('is-open');
    });
  }

  // Avatar dropdown menu
  const avatarBtn = document.getElementById('phAvatarBtn');
  if (avatarBtn) {
    const menu = document.createElement('div');
    menu.style.cssText = 'position:fixed;top:64px;right:28px;background:#fff;border:1px solid var(--auth-box-border);border-radius:8px;box-shadow:var(--shadow-lg);min-width:220px;z-index:900;display:none;overflow:hidden;';
    menu.innerHTML = `
      <div style="padding:14px 16px;border-bottom:1px solid var(--auth-box-border);background:var(--bodyBg)">
        <div style="font-weight:500;font-size:13px">${portal === 'insurance' ? 'Mariam Al-Naqbi' : portal === 'garage' ? 'Mariam Al-Maktoum' : portal === 'supplier' ? 'Omar Al-Mansouri' : 'Hamza Al-Otaiba'}</div>
        <div style="font-size:11px;color:var(--ink-400)">${portal === 'insurance' ? 'Claims Lead' : portal === 'garage' ? 'Owner — Royal Swiss' : portal === 'supplier' ? 'Owner — Gulf Auto' : 'Super Admin'}</div>
      </div>
      <a href="my-account.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--bodyText);font-size:13px">${PHIcon('user', 16)} My Account</a>
      <a href="notifications.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--bodyText);font-size:13px">${PHIcon('bell', 16)} Notifications</a>
      ${portal === 'admin' ? `<a href="settings.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--bodyText);font-size:13px">${PHIcon('settings', 16)} Settings</a>` : `<a href="subscription.html" style="display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--bodyText);font-size:13px">${PHIcon('sub', 16)} Subscription</a>`}
      <a href="javascript:alert('Help center coming up.')" style="display:flex;align-items:center;gap:10px;padding:10px 16px;color:var(--bodyText);font-size:13px;border-top:1px solid var(--auth-box-border)">${PHIcon('info', 16)} Help &amp; Support</a>
      <a href="../index.html" id="phLogoutLink" style="display:flex;align-items:center;gap:10px;padding:12px 16px;color:var(--brand-red);font-size:13px;font-weight:500;border-top:1px solid var(--auth-box-border);background:var(--brand-red-ghost)">${PHIcon('logout', 16)} Logout</a>
    `;
    document.body.appendChild(menu);
    avatarBtn.addEventListener('click', e => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && e.target !== avatarBtn) menu.style.display = 'none';
    });
    document.getElementById('phLogoutLink').addEventListener('click', e => {
      if (!confirm('Sign out of PartsHub?')) e.preventDefault();
    });
  }
};

document.addEventListener('DOMContentLoaded', window.PHRenderShell);
