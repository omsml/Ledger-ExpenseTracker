/* ── CATEGORIES ── */
const CATS = {
  Food:          { color:'#e05252', bg:'rgba(224,82,82,0.12)',    icon:'🍽️' },
  Travel:        { color:'#4f7fe8', bg:'rgba(79,127,232,0.12)',  icon:'✈️' },
  Shopping:      { color:'#7c6be8', bg:'rgba(124,107,232,0.12)', icon:'🛍️' },
  Health:        { color:'#3dba7e', bg:'rgba(61,186,126,0.12)',  icon:'💊' },
  Bills:         { color:'#e8a83d', bg:'rgba(232,168,61,0.12)',  icon:'📄' },
  Entertainment: { color:'#e07c3d', bg:'rgba(224,124,61,0.12)',  icon:'🎭' },
  Education:     { color:'#2ec4b6', bg:'rgba(46,196,182,0.12)',  icon:'📚' },
  Other:         { color:'#8a93b4', bg:'rgba(138,147,180,0.12)', icon:'📦' },
};

/* ── STATE ── */
let exps   = JSON.parse(localStorage.getItem('ldg_exps') || '[]');
let budget = parseFloat(localStorage.getItem('ldg_bud') || '0');
let editId = null;
let donutChart = null;
let barChart   = null;

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Default: light mode
  const savedTheme = localStorage.getItem('ldg_theme') || 'light';
  applyTheme(savedTheme === 'dark');

  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('eDate').value = today;
  document.getElementById('mDate').value = today;

  // Restore budget input
  if (budget > 0) document.getElementById('budInp').value = budget;

  renderAll();
});

/* ── THEME ── */
function applyTheme(isDark) {
  const theme = isDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ldg_theme', theme);

  const chk = document.getElementById('themeChk');
  if (chk) chk.checked = isDark;

  const lbl = document.getElementById('themeLabel');
  if (lbl) lbl.textContent = isDark ? 'Dark Mode' : 'Light Mode';

  const mobIcon = document.getElementById('mobThemeIcon');
  if (mobIcon) mobIcon.className = isDark ? 'fas fa-moon' : 'fas fa-circle-half-stroke';

  // Re-render charts to apply theme colours
  if (donutChart || barChart) renderCharts();
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur !== 'dark');
}

/* ── SIDEBAR (mobile) ── */
function toggleSidebar() {
  const sb  = document.getElementById('sidebar');
  const ovl = document.getElementById('sidebarOverlay');
  const open = sb.classList.toggle('open');
  ovl.classList.toggle('visible', open);
}

/* ── NAV ── */
function navTo(btn, section) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  scrollTo(section);
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── BUDGET ── */
function setBudget() {
  const val = parseFloat(document.getElementById('budInp').value);
  if (isNaN(val) || val < 0) {
    toast('Please enter a valid budget amount.', 'err');
    return;
  }
  budget = val;
  localStorage.setItem('ldg_bud', budget);
  renderSummary();
  toast(`Budget set to ₹${fmt(budget)}`, 'ok');
}

/* ── ADD EXPENSE ── */
function addExp() {
  const title  = document.getElementById('eTitle').value.trim();
  const amount = parseFloat(document.getElementById('eAmt').value);
  const cat    = document.getElementById('eCat').value;
  const date   = document.getElementById('eDate').value;

  if (!title || isNaN(amount) || amount <= 0 || !cat || !date) {
    toast('Please fill in all fields correctly.', 'err');
    return;
  }

  exps.unshift({ id: Date.now(), title, amount, category: cat, date });
  save();
  renderAll();

  // Reset form
  document.getElementById('eTitle').value = '';
  document.getElementById('eAmt').value   = '';
  document.getElementById('eCat').value   = '';
  document.getElementById('eDate').value  = new Date().toISOString().split('T')[0];

  toast(`"${title}" — ₹${fmt(amount)} recorded.`, 'ok');
}

/* ── DELETE ── */
function delExp(id) {
  if (!confirm('Remove this transaction?')) return;
  exps = exps.filter(e => e.id !== id);
  save();
  renderAll();
  toast('Transaction removed.', 'info');
}

/* ── EDIT ── */
function openEdit(id) {
  const e = exps.find(x => x.id === id);
  if (!e) return;
  editId = id;
  document.getElementById('mTitle').value = e.title;
  document.getElementById('mAmt').value   = e.amount;
  document.getElementById('mCat').value   = e.category;
  document.getElementById('mDate').value  = e.date;
  document.getElementById('editOvl').classList.add('open');
}

function closeEdit() {
  document.getElementById('editOvl').classList.remove('open');
  editId = null;
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) closeEdit();
}

function saveEdit() {
  const title  = document.getElementById('mTitle').value.trim();
  const amount = parseFloat(document.getElementById('mAmt').value);
  const cat    = document.getElementById('mCat').value;
  const date   = document.getElementById('mDate').value;

  if (!title || isNaN(amount) || amount <= 0 || !cat || !date) {
    toast('Please fill in all fields correctly.', 'err');
    return;
  }

  const idx = exps.findIndex(e => e.id === editId);
  if (idx !== -1) {
    exps[idx] = { ...exps[idx], title, amount, category: cat, date };
  }
  save();
  renderAll();
  closeEdit();
  toast('Transaction updated successfully.', 'ok');
}

/* ── RENDER ALL ── */
function renderAll() {
  renderList();
  renderSummary();
  renderCharts();
  renderCatBreakdown();
}

/* ── RENDER LIST ── */
function renderList() {
  const query  = document.getElementById('srchIn').value.toLowerCase();
  const catFil = document.getElementById('catFil').value;
  const el     = document.getElementById('expList');

  const filtered = exps.filter(e => {
    const matchQ = e.title.toLowerCase().includes(query) || e.category.toLowerCase().includes(query);
    const matchC = catFil ? e.category === catFil : true;
    return matchQ && matchC;
  });

  document.getElementById('listCnt').textContent =
    `${filtered.length} entr${filtered.length !== 1 ? 'ies' : 'y'}`;

  if (!filtered.length) {
    el.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No transactions found.</p>
      </div>`;
    return;
  }

  el.innerHTML = filtered.map((e, i) => {
    const cat = CATS[e.category] || CATS.Other;
    return `
      <div class="exp-item" style="animation-delay:${i * 0.03}s">
        <div class="exp-badge" style="background:${cat.bg}">${cat.icon}</div>
        <div class="exp-info">
          <div class="exp-name">${esc(e.title)}</div>
          <div class="exp-meta">
            <span class="exp-tag" style="background:${cat.bg};color:${cat.color}">${e.category}</span>
            <span class="exp-date">${fmtDate(e.date)}</span>
          </div>
        </div>
        <div class="exp-amount">₹${fmt(e.amount)}</div>
        <div class="exp-actions">
          <button class="act-btn edit" onclick="openEdit(${e.id})" title="Edit">
            <i class="fas fa-pencil"></i>
          </button>
          <button class="act-btn del" onclick="delExp(${e.id})" title="Delete">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </div>`;
  }).join('');
}

/* ── RENDER SUMMARY ── */
function renderSummary() {
  const total = exps.reduce((s, e) => s + e.amount, 0);
  const rem   = budget - total;
  const pct   = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  document.getElementById('kBud').textContent  = `₹${fmt(budget)}`;
  document.getElementById('kBudS').textContent = budget > 0 ? 'Monthly limit active' : 'Not configured';

  document.getElementById('kSpt').textContent  = `₹${fmt(total)}`;
  document.getElementById('kSptS').textContent = budget > 0
    ? `${pct.toFixed(1)}% of budget used`
    : `${exps.length} transaction${exps.length !== 1 ? 's' : ''}`;

  document.getElementById('kBar').style.width = `${pct}%`;

  document.getElementById('kRem').textContent  = budget > 0 ? `₹${fmt(Math.max(rem, 0))}` : '—';
  document.getElementById('kRemS').textContent = budget > 0
    ? (rem < 0 ? `⚠ Over by ₹${fmt(Math.abs(rem))}` : 'Available to spend')
    : 'Set a budget to track';

  document.getElementById('kCnt').textContent  = exps.length;
  document.getElementById('kCntS').textContent = `transaction${exps.length !== 1 ? 's' : ''} recorded`;
}

/* ── RENDER CHARTS ── */
function renderCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const tickColor = isDark ? '#50597a' : '#9aa0be';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const legendColor = isDark ? '#8891b4' : '#5a6080';

  // Category totals
  const catTotals = {};
  exps.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const cats   = Object.keys(catTotals);
  const vals   = Object.values(catTotals);
  const colors = cats.map(c => (CATS[c] || CATS.Other).color);

  // Donut
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(document.getElementById('donut').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: cats.length ? cats : ['No Data'],
      datasets: [{
        data: cats.length ? vals : [1],
        backgroundColor: cats.length ? colors : ['#2a2e4a'],
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: legendColor,
            font: { family: 'DM Sans, sans-serif', size: 11 },
            boxWidth: 9,
            padding: 12,
            usePointStyle: true,
            pointStyleWidth: 9,
          }
        },
        tooltip: {
          callbacks: { label: ctx => ` ₹${fmt(ctx.raw)}` }
        }
      },
      animation: { duration: 600 }
    }
  });

  // 7-day bar
  const days = [];
  const dayMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key   = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    days.push({ key, label });
    dayMap[key] = 0;
  }
  exps.forEach(e => { if (dayMap.hasOwnProperty(e.date)) dayMap[e.date] += e.amount; });

  if (barChart) barChart.destroy();
  const bCtx = document.getElementById('bar7').getContext('2d');
  const grad = bCtx.createLinearGradient(0, 0, 0, 180);
  grad.addColorStop(0, 'rgba(79,127,232,0.85)');
  grad.addColorStop(1, 'rgba(124,107,232,0.65)');

  barChart = new Chart(bCtx, {
    type: 'bar',
    data: {
      labels: days.map(d => d.label),
      datasets: [{
        data: days.map(d => dayMap[d.key]),
        backgroundColor: grad,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ₹${fmt(ctx.raw)}` } }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { family: 'DM Sans, sans-serif', size: 11 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { family: 'DM Sans, sans-serif', size: 11 },
            callback: v => '₹' + fmt(v)
          }
        }
      },
      animation: { duration: 500 }
    }
  });
}

/* ── CATEGORY BREAKDOWN ── */
function renderCatBreakdown() {
  const catTotals = {};
  exps.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const total  = Object.values(catTotals).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const el = document.getElementById('catBd');

  if (!sorted.length) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem;font-style:italic;padding:8px 0">No data yet.</p>`;
    return;
  }

  el.innerHTML = sorted.map(([cat, amt]) => {
    const c   = CATS[cat] || CATS.Other;
    const pct = ((amt / total) * 100).toFixed(1);
    return `
      <div class="cat-row">
        <div class="cat-row-top">
          <div class="cat-name-wrap">
            <div class="cat-dot-sm" style="background:${c.color}"></div>
            <span>${c.icon} ${cat}</span>
          </div>
          <div class="cat-amount">₹${fmt(amt)}</div>
        </div>
        <div class="cat-progress">
          <div class="cat-fill" style="width:${pct}%;background:${c.color}"></div>
        </div>
      </div>`;
  }).join('');
}

/* ── EXPORT CSV ── */
function exportCSV() {
  if (!exps.length) { toast('No transactions to export.', 'err'); return; }
  const rows = [
    ['Description', 'Amount (INR)', 'Category', 'Date'],
    ...exps.map(e => [e.title, e.amount, e.category, e.date])
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const a   = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `ledger_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  toast('Exported successfully.', 'ok');
}

/* ── TOAST ── */
function toast(msg, type = 'info') {
  const icons = { ok: 'fa-circle-check', err: 'fa-circle-xmark', info: 'fa-circle-info' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fas ${icons[type]}"></i>${esc(msg)}`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s ease';
    setTimeout(() => el.remove(), 320);
  }, 3000);
}

/* ── UTILS ── */
function save() { localStorage.setItem('ldg_exps', JSON.stringify(exps)); }

function fmt(n) {
  return Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
