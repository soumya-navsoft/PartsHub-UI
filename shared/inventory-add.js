// ============ Add Inventory — Multi-step form (shared logic) ============
// Wrapper page sets window.__addInvConfig before this loads. Shape:
// { portal: 'insurance' | 'garage' | 'supplier', backHref: 'inventory.html' }

(function () {
  'use strict';

  const cfg = window.__addInvConfig || { portal: 'supplier', backHref: 'inventory.html' };

  // -------- Per-portal copy / fields --------
  const PORTAL_COPY = {
    insurance: {
      pageTitle: 'Add Inventory',
      step3Title: 'Source, Stock & Estimated Price',
      priceLabel: 'Acquisition Cost (AED)',
      locationLabel: 'Storage',
      extraCol: { key: 'source', label: 'Source', type: 'select', options: ['Closed claim', 'Salvage', 'Direct purchase', 'Hot Deal'], default: 'Closed claim' },
      extraCol2: { key: 'sourceRef', label: 'Reference', type: 'text', placeholder: 'JKLMN-...' },
      helper: 'Inventory items can only be added to Auctions or Hot Deals after they appear here. Master catalogue data is read-only — only quantity, price and source are editable.',
    },
    garage: {
      pageTitle: 'Add Parts to Inventory',
      step3Title: 'Stock, Cost & Bay Location',
      priceLabel: 'Cost Price (AED)',
      locationLabel: 'Bay / Shelf',
      extraCol: { key: 'sell', label: 'Sell Price (AED)', type: 'number', placeholder: '0' },
      extraCol2: { key: 'reorder', label: 'Reorder At', type: 'number', placeholder: '5' },
      helper: 'Parts kept on-shop. Use Cost Price for internal accounting and Sell Price if you resell to customers outside insurance jobs.',
    },
    supplier: {
      pageTitle: 'Add SKUs to Catalogue',
      step3Title: 'SKU, Stock & Sell Price',
      priceLabel: 'Sell Price (AED)',
      locationLabel: 'Warehouse',
      extraCol: { key: 'sku', label: 'Your SKU', type: 'text', placeholder: 'AUTO' },
      extraCol2: { key: 'reorder', label: 'Reorder At', type: 'number', placeholder: '20' },
      helper: 'SKU code must be unique across your catalogue. OEM-authorised supplier accounts can only list "OEM New" condition.',
    },
  };
  const copy = PORTAL_COPY[cfg.portal] || PORTAL_COPY.supplier;

  // -------- Vehicle taxonomy (cascading data — sample) --------
  const VTAX = {
    levels: [
      { key: 'type',     label: 'Type',         opts: ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Van', 'Motorcycle'] },
      { key: 'origin',   label: 'Origin',       opts: ['Japan', 'Germany', 'USA', 'South Korea', 'Italy', 'UK', 'France'] },
      { key: 'segment',  label: 'Brand Segment',opts: ['Mainstream', 'Premium', 'Luxury', 'Performance'] },
      { key: 'brand',    label: 'Brand',        opts: ['Toyota', 'Honda', 'Nissan', 'Lexus', 'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Hyundai', 'Kia', 'Ford', 'Chevrolet'] },
      { key: 'model',    label: 'Model',        opts: ['Camry', 'Corolla', 'Land Cruiser', 'Hilux', 'RAV4', 'Patrol', 'Altima', 'ES350', 'X3', 'X5', 'C-Class', 'E-Class', 'A6', 'A4'] },
      { key: 'year',     label: 'Year',         opts: ['2026','2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015'] },
      { key: 'variant',  label: 'Variant',      opts: ['Base', 'SE', 'XLE', 'LE', 'GLI', 'Sport', 'Premium', 'Limited'] },
      { key: 'body',     label: 'Body Type',    opts: ['4-door Sedan', '5-door SUV', 'Coupe', 'Estate', 'Convertible', 'Pickup'] },
      { key: 'engine',   label: 'Engine',       opts: ['1.6L I4', '2.0L I4', '2.4L I4', '2.5L I4', '3.0L V6', '3.5L V6', '4.0L V6', '5.0L V8'] },
      { key: 'trans',    label: 'Transmission', opts: ['5-Speed Manual', '6-Speed Manual', '6-Speed AT', '8-Speed AT', 'CVT', 'DCT'] },
    ]
  };

  // -------- Parts category --------
  const CATEGORIES = [
    { id: 'engine', label: 'Engine & Drivetrain', count: 1248, sub: ['Pistons & Rings', 'Cooling System', 'Lubrication', 'Air Intake', 'Fuel System', 'Exhaust', 'Belts & Hoses'] },
    { id: 'trans',  label: 'Transmission',         count: 512,  sub: ['Gearbox', 'Clutch', 'Driveshaft', 'CV Joints', 'Differential'] },
    { id: 'susp',   label: 'Suspension & Steering', count: 920, sub: ['Shock Absorbers', 'Springs', 'Bushings', 'Control Arms', 'Steering Rack', 'Tie Rods'] },
    { id: 'brake',  label: 'Braking System',       count: 784,  sub: ['Brake Pads', 'Brake Discs', 'Calipers', 'Master Cylinder', 'ABS Modules', 'Brake Lines'] },
    { id: 'light',  label: 'Lighting',             count: 420,  sub: ['Headlamps', 'Tail Lamps', 'Fog Lights', 'Indicator Lamps', 'Cabin Lighting'] },
    { id: 'elec',   label: 'Electrical',           count: 678,  sub: ['Battery', 'Alternator', 'Starter Motor', 'ECU & Sensors', 'Wiring Harness'] },
    { id: 'body',   label: 'Body & Panels',        count: 845,  sub: ['Bumpers', 'Fenders', 'Doors', 'Hood', 'Trunk Lid', 'Mirrors', 'Glass'] },
    { id: 'interior', label: 'Interior',           count: 312,  sub: ['Seats', 'Dashboard', 'Airbags', 'Steering Wheel', 'Trim Panels'] },
    { id: 'ac',     label: 'A/C & Heating',        count: 298,  sub: ['Compressor', 'Condenser', 'Evaporator', 'Blower Motor'] },
    { id: 'ev',     label: 'Electric Powertrain',  count: 386,  sub: ['Battery Pack', 'Inverter', 'Motor', 'Charging Port'] },
    { id: 'tire',   label: 'Tires & Wheels',       count: 540,  sub: ['Tires', 'Alloy Wheels', 'TPMS', 'Hub Caps'] },
    { id: 'fluid',  label: 'Fluids & Filters',     count: 230,  sub: ['Engine Oil', 'Coolant', 'Brake Fluid', 'Air Filter', 'Oil Filter', 'Cabin Filter'] },
  ];

  // Category icons (simple SVG)
  const CAT_ICON = {
    engine:   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h2l2-3h6l2 3h4v6h-2l-2 3h-6l-2-3H4z"/><circle cx="12" cy="14" r="2"/></svg>',
    trans:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><line x1="6" y1="9" x2="6" y2="13"/><line x1="18" y1="9" x2="18" y2="13"/><line x1="12" y1="13" x2="12" y2="15"/></svg>',
    susp:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4l8 0 M9 8l6 0 M8 12l8 0 M9 16l6 0 M8 20l8 0"/></svg>',
    brake:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/></svg>',
    light:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 4 12.7c-1 1-1 2-1 3H9c0-1 0-2-1-3A7 7 0 0 1 12 2z"/></svg>',
    elec:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    body:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16l2-6 4-3h6l4 3 2 6 0 3-4 0 0-2 -10 0 0 2 -4 0z"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></svg>',
    interior: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21V8a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v13"/><path d="M5 21h14"/><path d="M9 12h6"/></svg>',
    ac:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M5 5l14 14"/><path d="M19 5L5 19"/></svg>',
    ev:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="14" height="12" rx="2"/><line x1="18" y1="10" x2="20" y2="10"/><line x1="18" y1="14" x2="20" y2="14"/><line x1="9" y1="10" x2="9" y2="14"/><line x1="13" y1="10" x2="13" y2="14"/></svg>',
    tire:     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>',
    fluid:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l5 6a5 5 0 1 1-10 0z"/></svg>',
  };

  // -------- Master parts catalogue (sample, filterable) --------
  // [id, name, sku, brand, grade, categoryId, subCategory, fitment summary, est-price]
  const PARTS = [
    ['P-001', 'Premium Brake Pad Set (Front)', 'BR-FP-2025', 'Brembo',   'oem',         'brake', 'Brake Pads', 'Toyota Camry 2018-2024',   180],
    ['P-002', 'Ceramic Brake Pad Set (Front)', 'BR-FP-2026', 'Akebono',  'aftermarket', 'brake', 'Brake Pads', 'Honda Accord 2018-2023',   140],
    ['P-003', 'Vented Brake Disc 305 mm',      'BR-DC-310',  'Brembo',   'oem',         'brake', 'Brake Discs','BMW 3 Series 2018-2023',   320],
    ['P-004', 'Front Brake Caliper Assembly',  'BR-CL-FR04', 'TRW',      'aftermarket', 'brake', 'Calipers',   'Mercedes E-Class 2017-22', 720],
    ['P-005', 'ABS Control Module',            'BR-ABS-115', 'Bosch',    'oem',         'brake', 'ABS Modules','Audi A6 2019-2024',        1450],
    ['P-006', 'Shock Absorber (Rear)',         'SU-SA-118',  'KYB',      'aftermarket', 'susp',  'Shock Absorbers', 'Toyota Camry 2018-24', 350],
    ['P-007', 'Coil Spring Set',               'SU-CS-220',  'Eibach',   'aftermarket', 'susp',  'Springs',    'Honda Civic 2017-2022',     460],
    ['P-008', 'Control Arm Lower',             'SU-CA-LR',   'Moog',     'oem',         'susp',  'Control Arms','BMW X3 2018-2024',         580],
    ['P-009', 'Outer Tie Rod End',             'SU-TR-OE',   'Lemforder','oem',         'susp',  'Tie Rods',   'Mercedes C-Class 2018-23',  210],
    ['P-010', 'Steering Rack & Pinion',        'SU-SR-220',  'TRW',      'aftermarket', 'susp',  'Steering Rack','Nissan Altima 2016-2022',1420],
    ['P-011', 'Headlamp LH (LED)',             'LT-HL-LH04', 'Hella',    'oem',         'light', 'Headlamps',  'Audi A4 2018-2024',        1180],
    ['P-012', 'Headlamp RH (LED)',             'LT-HL-RH04', 'Hella',    'oem',         'light', 'Headlamps',  'Audi A4 2018-2024',        1180],
    ['P-013', 'Tail Lamp Assembly (Pair)',     'LT-TL-PR05', 'Depo',     'aftermarket', 'light', 'Tail Lamps', 'Toyota Corolla 2019-23',    420],
    ['P-014', 'Fog Light Set',                 'LT-FL-08',   'OSRAM',    'aftermarket', 'light', 'Fog Lights', 'Honda CR-V 2017-2022',      280],
    ['P-015', 'Engine Oil Pan',                'EN-OP-204',  'Genuine',  'oem',         'engine','Lubrication','Toyota Land Cruiser 2018', 880],
    ['P-016', 'Timing Belt Kit',               'EN-TB-122',  'Gates',    'aftermarket', 'engine','Belts & Hoses','Hyundai Tucson 2018-22',  460],
    ['P-017', 'Radiator Assembly',             'EN-RD-208',  'Denso',    'oem',         'engine','Cooling System','Toyota Camry 2018-24',   920],
    ['P-018', 'Air Intake Manifold',           'EN-AI-300',  'Pierburg', 'oem',         'engine','Air Intake', 'BMW 5 Series 2018-2023',  1240],
    ['P-019', 'Alternator 130A',               'EL-AL-130',  'Denso',    'oem',         'elec',  'Alternator', 'Honda Accord 2018-2023',    760],
    ['P-020', 'Starter Motor',                 'EL-SM-12',   'Bosch',    'oem',         'elec',  'Starter Motor','Toyota Hilux 2017-2022',  680],
    ['P-021', 'AGM Battery 100 Ah',            'EL-BT-100',  'Varta',    'aftermarket', 'elec',  'Battery',    'Universal · 12 V',          590],
    ['P-022', 'Wiring Harness (Engine bay)',   'EL-WH-EN',   'Genuine',  'oem',         'elec',  'Wiring Harness','Nissan Patrol 2018-22', 1820],
    ['P-023', 'Front Bumper Cover',            'BO-BC-FR',   'OEM',      'oem',         'body',  'Bumpers',    'Toyota Camry 2018-2021',    920],
    ['P-024', 'Front Fender LH',               'BO-FN-LH',   'OEM',      'oem',         'body',  'Fenders',    'Honda Civic 2017-2022',     520],
    ['P-025', 'Side Mirror (Power-fold)',      'BO-MR-PF',   'Genuine',  'oem',         'body',  'Mirrors',    'BMW 3 Series 2018-2023',    780],
    ['P-026', 'A/C Compressor 12 V',           'AC-CP-12',   'Denso',    'oem',         'ac',    'Compressor', 'Toyota Land Cruiser',      1640],
    ['P-027', 'Condenser Assembly',            'AC-CD-110',  'Behr',     'aftermarket', 'ac',    'Condenser',  'Honda Accord 2018-2023',    480],
    ['P-028', 'CVT Gearbox',                   'TR-CVT-22',  'Jatco',    'oem',         'trans', 'Gearbox',    'Nissan Altima 2017-2022',  4200],
    ['P-029', 'Clutch Kit (3-piece)',          'TR-CL-03',   'Exedy',    'aftermarket', 'trans', 'Clutch',     'Honda Civic 2017-2021',     780],
    ['P-030', 'Driveshaft (Rear)',             'TR-DS-RR',   'GKN',      'oem',         'trans', 'Driveshaft', 'Toyota Hilux 2016-2022',    920],
    ['P-031', '17" Alloy Wheel',               'TI-AW-17',   'Enkei',    'aftermarket', 'tire',  'Alloy Wheels','Universal · 5x114.3',       540],
    ['P-032', 'TPMS Sensor',                   'TI-TP-04',   'Schrader', 'oem',         'tire',  'TPMS',       'Universal · 433 MHz',       180],
    ['P-033', 'Cabin Air Filter',              'FL-CA-04',   'Mann',     'aftermarket', 'fluid', 'Cabin Filter','Toyota Camry 2018-24',      60],
    ['P-034', 'Engine Oil 5W-30 (5L)',         'FL-EO-530',  'Mobil 1',  'aftermarket', 'fluid', 'Engine Oil', 'Universal · API SP',        220],
    ['P-035', 'EV Inverter Module',            'EV-IV-22',   'Genuine',  'oem',         'ev',    'Inverter',   'Tesla Model 3 2020-2024',  4800],
    ['P-036', 'EV Charging Port',              'EV-CP-T2',   'Genuine',  'oem',         'ev',    'Charging Port','Tesla / Universal Type 2', 980],
  ];

  // -------- State --------
  const state = {
    step: 1,
    fitmentMode: 'specific', // 'specific' | 'universal'
    fitment: {}, // levelKey -> value
    catId: null,
    subCat: null, // null means "all under category"
    search: '',
    gradeFilter: 'all', // all | oem | aftermarket
    selected: new Set(), // part ids
    stockData: {}, // partId -> { qty, price, condition, location, extra, extra2, notes }
  };

  // -------- Render helpers --------
  function $(sel) { return document.querySelector(sel); }
  function ensureStockRow(id) {
    if (!state.stockData[id]) {
      state.stockData[id] = { qty: 1, price: '', condition: 'OEM New', location: '', extra: copy.extraCol.default || '', extra2: '', notes: '' };
      // Default unit price suggestion = est-price from master
      const p = PARTS.find(r => r[0] === id);
      if (p) state.stockData[id].price = p[8];
    }
  }
  function deselect(id) { state.selected.delete(id); delete state.stockData[id]; }

  // -------- Step rendering --------
  function renderSteps() {
    const stepsEl = $('#aivSteps');
    const labels = ['Vehicle & Category', 'Pick Parts', copy.step3Title];
    const subs   = ['Set fitment scope',    'From master catalogue', 'Quantity, price & details'];
    stepsEl.innerHTML = labels.map((lbl, i) => {
      const n = i + 1;
      const cls = state.step === n ? 'is-active' : (state.step > n ? 'is-done' : '');
      const sep = i < labels.length - 1
        ? `<div class="aiv-step__sep ${state.step > n ? 'is-done' : ''}"></div>` : '';
      const bullet = state.step > n ? '✓' : String(n).padStart(2, '0');
      return `
        <div class="aiv-step ${cls}">
          <div class="aiv-step__num">${bullet}</div>
          <div><div class="aiv-step__lbl">${lbl}</div><div class="aiv-step__sub">${subs[i]}</div></div>
        </div>${sep}`;
    }).join('');
  }

  function renderStep1() {
    const vrows = VTAX.levels.map((lvl, i) => `
      <div class="aiv-vfield">
        <label class="aiv-vfield__label"><span class="aiv-vfield__lvl">L${i+1}</span> ${lvl.label}</label>
        <select data-vlvl="${lvl.key}" ${state.fitmentMode === 'universal' ? 'disabled' : ''}>
          <option value="">— Any —</option>
          ${lvl.opts.map(o => `<option value="${o}" ${state.fitment[lvl.key] === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>
    `).join('');

    const fitChips = Object.entries(state.fitment).filter(([_, v]) => v).map(([k, v]) =>
      `<span class="aiv-chip is-strong">${v}</span>`).join('');

    const cats = CATEGORIES.map(c => `
      <div class="aiv-cat ${state.catId === c.id ? 'is-active' : ''}" data-cat="${c.id}">
        <div class="aiv-cat__ic">${CAT_ICON[c.id] || ''}</div>
        <div class="aiv-cat__lbl">${c.label}</div>
        <div class="aiv-cat__count">${c.count.toLocaleString()} parts</div>
      </div>
    `).join('');

    const activeCat = CATEGORIES.find(c => c.id === state.catId);
    const subs = activeCat ? `
      <div class="aiv-sub">
        <div class="aiv-subrow">
          <span class="aiv-subrow__lbl">Sub-category in ${activeCat.label}:</span>
          <button class="aiv-pill ${state.subCat === null ? 'is-active' : ''}" data-sub="">All</button>
          ${activeCat.sub.map(s => `<button class="aiv-pill ${state.subCat === s ? 'is-active' : ''}" data-sub="${s}">${s}</button>`).join('')}
        </div>
      </div>` : '';

    $('#aivBody').innerHTML = `
      <div class="aiv-section">
        <h3 class="aiv-section__h">Vehicle Fitment <span class="sub">10-level taxonomy · narrows the catalogue</span></h3>
        <div class="aiv-toggle">
          <button data-mode="specific" class="${state.fitmentMode === 'specific' ? 'is-active' : ''}">Vehicle-specific</button>
          <button data-mode="universal" class="${state.fitmentMode === 'universal' ? 'is-active' : ''}">Universal · fits many</button>
        </div>
        <div class="aiv-vgrid">${vrows}</div>
        ${state.fitmentMode === 'specific' && fitChips ? `<div class="aiv-fitchips"><span class="aiv-fitchips__lbl">Selected:</span> ${fitChips}</div>` : ''}
      </div>

      <div class="aiv-section">
        <h3 class="aiv-section__h">Parts Category <span class="sub">Multi-level master · pick a category to filter</span></h3>
        <div class="aiv-cats">${cats}</div>
        ${subs}
      </div>
    `;

    // Wire
    $('#aivBody').querySelectorAll('.aiv-toggle button').forEach(b => {
      b.addEventListener('click', () => { state.fitmentMode = b.dataset.mode; renderStep1(); updateFoot(); });
    });
    $('#aivBody').querySelectorAll('.aiv-vfield select').forEach(sel => {
      sel.addEventListener('change', e => { state.fitment[e.target.dataset.vlvl] = e.target.value; renderStep1(); updateFoot(); });
    });
    $('#aivBody').querySelectorAll('.aiv-cat').forEach(c => {
      c.addEventListener('click', () => { state.catId = c.dataset.cat; state.subCat = null; renderStep1(); updateFoot(); });
    });
    $('#aivBody').querySelectorAll('.aiv-pill[data-sub]').forEach(p => {
      p.addEventListener('click', () => { state.subCat = p.dataset.sub || null; renderStep1(); });
    });
  }

  function filterParts() {
    return PARTS.filter(r => {
      if (state.catId && r[5] !== state.catId) return false;
      if (state.subCat && r[6] !== state.subCat) return false;
      if (state.gradeFilter !== 'all' && r[4] !== state.gradeFilter) return false;
      if (state.search) {
        const q = state.search.toLowerCase();
        if (![r[1], r[2], r[3], r[7]].some(v => v.toLowerCase().includes(q))) return false;
      }
      // Vehicle fitment: text-contains match for brand & model & year (if set)
      if (state.fitmentMode === 'specific') {
        const fit = r[7].toLowerCase();
        for (const k of ['brand', 'model']) {
          const v = (state.fitment[k] || '').toLowerCase();
          if (v && !fit.includes(v) && !fit.includes('universal')) return false;
        }
        // Year fuzzy: see if year is within range like "2018-2024"
        if (state.fitment.year && !fit.includes('universal')) {
          const y = +state.fitment.year;
          const m = fit.match(/(\d{4})\s*[-–]\s*(\d{2,4})/);
          if (m) {
            const ystart = +m[1];
            const yend = (m[2].length === 2) ? (Math.floor(ystart/100)*100 + +m[2]) : +m[2];
            if (y < ystart || y > yend) return false;
          }
        }
      }
      return true;
    });
  }

  function renderStep2() {
    const rows = filterParts();
    const fitSummary = state.fitmentMode === 'universal' ? 'Universal · fits many'
      : Object.values(state.fitment).filter(Boolean).join(' · ') || 'All vehicles';
    const cat = CATEGORIES.find(c => c.id === state.catId);
    const catSummary = cat ? (cat.label + (state.subCat ? ' › ' + state.subCat : '')) : 'All categories';

    $('#aivBody').innerHTML = `
      <div class="aiv-cart">
        <div class="aiv-cart__count">${state.selected.size}</div>
        <div class="aiv-cart__lbl"><strong>parts selected</strong> · scope: ${fitSummary} · ${catSummary}</div>
        <div class="aiv-cart__spacer"></div>
        ${state.selected.size ? `<button class="aiv-cart__clear" id="aivClearAll">Clear selection</button>` : ''}
      </div>

      <div class="aiv-search-row">
        <div class="aiv-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="aivQ" placeholder="Search by name, SKU, brand or fitment..." value="${state.search}"/>
        </div>
        <button class="aiv-filter-chip ${state.gradeFilter === 'all' ? 'is-active' : ''}" data-grade="all">All grades</button>
        <button class="aiv-filter-chip ${state.gradeFilter === 'oem' ? 'is-active' : ''}" data-grade="oem">OEM</button>
        <button class="aiv-filter-chip ${state.gradeFilter === 'aftermarket' ? 'is-active' : ''}" data-grade="aftermarket">Aftermarket</button>
      </div>

      <div class="aiv-parts-wrap">
        <table class="aiv-parts">
          <thead>
            <tr>
              <th style="width:48%">Part</th>
              <th>Brand</th>
              <th>Grade</th>
              <th>Fitment</th>
              <th style="text-align:right">Est. Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="aivPartsBody">
            ${rows.length ? rows.map(r => {
              const [id, name, sku, brand, grade, , , fit, price] = r;
              const isSel = state.selected.has(id);
              const gradeLbl = grade === 'oem' ? 'OEM' : (grade === 'aftermarket' ? 'Aftermarket' : 'Refurb');
              return `<tr data-id="${id}" class="${isSel ? 'is-selected' : ''}">
                <td><div class="aiv-pcell"><div class="aiv-pthumb">⚙</div><div><div class="aiv-pcell__name">${name}</div><div class="aiv-pcell__sku">${sku}</div></div></div></td>
                <td>${brand}</td>
                <td><span class="aiv-grade ${grade}">${gradeLbl}</span></td>
                <td style="color:var(--ink-500);font-size:12.5px">${fit}</td>
                <td style="text-align:right;color:var(--ink-700)">AED ${price.toLocaleString()}</td>
                <td><button class="aiv-addbtn ${isSel ? 'is-added' : ''}" data-toggle="${id}">${isSel ? 'Added' : '+ Add'}</button></td>
              </tr>`;
            }).join('') : `<tr><td colspan="6"><div class="aiv-empty"><strong>No parts match this filter</strong>Loosen the fitment or category — or use Universal scope.</div></td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    // Wire
    $('#aivQ').addEventListener('input', e => { state.search = e.target.value; renderStep2(); });
    $('#aivBody').querySelectorAll('.aiv-filter-chip').forEach(c => c.addEventListener('click', () => { state.gradeFilter = c.dataset.grade; renderStep2(); }));
    $('#aivBody').querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.toggle;
      if (state.selected.has(id)) deselect(id); else { state.selected.add(id); ensureStockRow(id); }
      renderStep2(); updateFoot();
    }));
    const clear = $('#aivClearAll');
    if (clear) clear.addEventListener('click', () => { state.selected.clear(); state.stockData = {}; renderStep2(); updateFoot(); });
  }

  function renderStep3() {
    const ids = [...state.selected];
    const rows = ids.map(id => PARTS.find(r => r[0] === id)).filter(Boolean);
    ensureAllStock(ids);

    const extra = copy.extraCol;
    const extra2 = copy.extraCol2;
    let totalUnits = 0, totalValue = 0;

    const tbody = rows.map(r => {
      const [id, name, sku, brand, grade] = r;
      const d = state.stockData[id];
      const qty = +d.qty || 0;
      const price = +d.price || 0;
      const line = qty * price;
      totalUnits += qty;
      totalValue += line;

      const extraInput = extra.type === 'select'
        ? `<select data-id="${id}" data-k="extra">${extra.options.map(o => `<option ${d.extra === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`
        : `<input data-id="${id}" data-k="extra" type="${extra.type}" placeholder="${extra.placeholder || ''}" value="${d.extra || ''}"/>`;
      const extra2Input = extra2.type === 'select'
        ? `<select data-id="${id}" data-k="extra2">${extra2.options.map(o => `<option ${d.extra2 === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`
        : `<input data-id="${id}" data-k="extra2" type="${extra2.type}" placeholder="${extra2.placeholder || ''}" value="${d.extra2 || ''}"/>`;

      return `<tr>
        <td style="min-width:240px">
          <div class="aiv-pcell"><div class="aiv-pthumb">⚙</div><div>
            <div class="aiv-pcell__name">${name}</div>
            <div class="aiv-pcell__sku">${sku} · ${brand} · <span class="aiv-grade ${grade}">${grade === 'oem' ? 'OEM' : (grade === 'aftermarket' ? 'Aftermarket' : 'Refurb')}</span></div>
          </div></div>
        </td>
        <td style="width:90px"><input data-id="${id}" data-k="qty" type="number" min="0" value="${d.qty}"/></td>
        <td style="width:120px"><input data-id="${id}" data-k="price" type="number" min="0" step="1" value="${d.price}"/></td>
        <td style="width:140px"><select data-id="${id}" data-k="condition">
          ${['OEM New','Aftermarket New','Refurbished','Used'].map(o => `<option ${d.condition === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select></td>
        <td style="width:160px"><input data-id="${id}" data-k="location" type="text" placeholder="${copy.locationLabel}..." value="${d.location || ''}"/></td>
        <td style="width:160px">${extraInput}</td>
        <td style="width:130px">${extra2Input}</td>
        <td style="width:110px;text-align:right" class="aiv-stock__line">AED ${line.toLocaleString()}</td>
        <td style="width:36px;text-align:right"><button class="aiv-stock__del" data-rm="${id}" title="Remove">✕</button></td>
      </tr>`;
    }).join('');

    $('#aivBody').innerHTML = `
      <div class="aiv-section">
        <h3 class="aiv-section__h">${copy.step3Title} <span class="sub">${rows.length} part${rows.length !== 1 ? 's' : ''} selected · edit details below</span></h3>
        <div class="aiv-stock-wrap">
          <table class="aiv-stock">
            <thead>
              <tr>
                <th>Part</th>
                <th>Qty</th>
                <th>${copy.priceLabel}</th>
                <th>Condition</th>
                <th>${copy.locationLabel}</th>
                <th>${extra.label}</th>
                <th>${extra2.label}</th>
                <th style="text-align:right">Line value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>${tbody || `<tr><td colspan="9"><div class="aiv-empty"><strong>No parts selected</strong>Go back to Step 2 and pick some parts first.</div></td></tr>`}</tbody>
          </table>
          <div class="aiv-totalbar">
            <div class="aiv-totalbar__cell"><span class="aiv-totalbar__lbl">Line items</span><span class="aiv-totalbar__val">${rows.length}</span></div>
            <div class="aiv-totalbar__cell"><span class="aiv-totalbar__lbl">Total stock units</span><span class="aiv-totalbar__val">${totalUnits.toLocaleString()}</span></div>
            <div class="aiv-totalbar__spacer"></div>
            <div class="aiv-totalbar__cell" style="text-align:right"><span class="aiv-totalbar__lbl">Total inventory value</span><span class="aiv-totalbar__val red">AED ${totalValue.toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      <div class="aiv-helper"><strong>Tip:</strong> ${copy.helper}</div>
    `;

    // Wire inputs
    $('#aivBody').querySelectorAll('[data-id]').forEach(inp => {
      inp.addEventListener('input', () => {
        const id = inp.dataset.id, k = inp.dataset.k;
        state.stockData[id][k] = inp.value;
        if (k === 'qty' || k === 'price') renderStep3();
      });
      inp.addEventListener('change', () => {
        const id = inp.dataset.id, k = inp.dataset.k;
        state.stockData[id][k] = inp.value;
      });
    });
    $('#aivBody').querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
      deselect(b.dataset.rm); renderStep3(); updateFoot();
    }));
  }

  function ensureAllStock(ids) { ids.forEach(ensureStockRow); }

  // -------- Footer / navigation --------
  function updateFoot() {
    const foot = $('#aivFoot');
    const canStep2 = state.fitmentMode === 'universal' || Object.values(state.fitment).some(v => v) || state.catId;
    const canStep3 = state.selected.size > 0;
    const goodSave = canStep3 && [...state.selected].every(id => {
      const d = state.stockData[id];
      return d && +d.qty > 0 && +d.price > 0;
    });

    if (state.step === 1) {
      foot.innerHTML = `
        <a class="aiv-foot__cancel" href="${cfg.backHref}">Cancel</a>
        <div class="aiv-foot__spacer"></div>
        <button class="aiv-foot__next" id="aivNext" ${canStep2 ? '' : 'disabled'}>Continue to Pick Parts →</button>
      `;
    } else if (state.step === 2) {
      foot.innerHTML = `
        <button class="aiv-foot__back" id="aivBack">← Back</button>
        <a class="aiv-foot__cancel" href="${cfg.backHref}">Cancel</a>
        <div class="aiv-foot__spacer"></div>
        <span style="font-size:12.5px;color:var(--ink-500);margin-right:8px">${state.selected.size} part${state.selected.size !== 1 ? 's' : ''} selected</span>
        <button class="aiv-foot__next" id="aivNext" ${canStep3 ? '' : 'disabled'}>Continue to Stock & Pricing →</button>
      `;
    } else {
      foot.innerHTML = `
        <button class="aiv-foot__back" id="aivBack">← Back</button>
        <a class="aiv-foot__cancel" href="${cfg.backHref}">Cancel</a>
        <div class="aiv-foot__spacer"></div>
        <button class="aiv-foot__addmore" id="aivAddMore">+ Add more parts</button>
        <button class="aiv-foot__save" id="aivSave" ${goodSave ? '' : 'disabled'}>Save ${state.selected.size} item${state.selected.size !== 1 ? 's' : ''} to inventory</button>
      `;
    }
    const next = $('#aivNext'); if (next) next.addEventListener('click', () => go(state.step + 1));
    const back = $('#aivBack'); if (back) back.addEventListener('click', () => go(state.step - 1));
    const addMore = $('#aivAddMore'); if (addMore) addMore.addEventListener('click', () => go(2));
    const save = $('#aivSave'); if (save) save.addEventListener('click', () => {
      alert(`Saved ${state.selected.size} item${state.selected.size !== 1 ? 's' : ''} to inventory.`);
      window.location.href = cfg.backHref;
    });
  }

  function go(step) {
    state.step = Math.max(1, Math.min(3, step));
    renderSteps();
    if (state.step === 1) renderStep1();
    else if (state.step === 2) renderStep2();
    else renderStep3();
    updateFoot();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // -------- Boot --------
  function boot() {
    const host = $('#aivHost');
    if (!host) return;
    host.innerHTML = `
      <div class="aiv-wrap">
        <div class="aiv-steps" id="aivSteps"></div>
        <div class="aiv-body" id="aivBody"></div>
        <div class="aiv-foot" id="aivFoot"></div>
      </div>
    `;
    go(1);
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
