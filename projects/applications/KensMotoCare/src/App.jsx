import React from 'react';
import { sx } from './sx';
import { Icon, ItemIcon, CatIcon, LogoMark } from './icons';

// ── Maintenance catalog (from the design spec) ──────────────────────────────
const ITEMS = [
  { id: 'oil',      name: 'Engine Oil',             emoji: '🛢',  cat: 'Engine',       interval: 1500 },
  { id: 'gear',     name: 'Gear Oil',               emoji: '⚙️', cat: 'Transmission', interval: 3000 },
  { id: 'cvt',      name: 'CVT Cleaning',           emoji: '🌀', cat: 'CVT',          interval: 4000 },
  { id: 'air',      name: 'Air Filter',             emoji: '🌬️', cat: 'Engine',       interval: 8000 },
  { id: 'spark',    name: 'Spark Plug',             emoji: '🔥', cat: 'Engine',       interval: 12000 },
  { id: 'throttle', name: 'Throttle Body Cleaning', emoji: '🧴', cat: 'Engine',       interval: 12000 },
  { id: 'pads',     name: 'Brake Pads Inspection',  emoji: '🛑', cat: 'Brakes',       interval: 12000 },
  { id: 'shoes',    name: 'Brake Shoes Inspection', emoji: '🛑', cat: 'Brakes',       interval: 12000 },
  { id: 'susp',     name: 'Front Suspension Repack',emoji: '🛞', cat: 'Suspension',   interval: 12000 },
  { id: 'battery',  name: 'Battery',                emoji: '🔋', cat: 'Electrical',   interval: 20000 },
  { id: 'vbelt',    name: 'V-Belt Replacement',     emoji: '🔗', cat: 'CVT',          interval: 24000 }
];
const CATS = [
  { name: 'Engine',       emoji: '🛢' },
  { name: 'Transmission', emoji: '⚙️' },
  { name: 'CVT',          emoji: '🌀' },
  { name: 'Brakes',       emoji: '🛑' },
  { name: 'Suspension',   emoji: '🛞' },
  { name: 'Electrical',   emoji: '🔋' }
];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

const CURRENCY = '₱';
const DUE_SOON_PCT = 25;
const STORAGE_KEY = 'kens-motorcare-v1';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  // ── State setup & persistence ─────────────────────────────────────────────
  initialState() {
    const base = {
      screen: 'dashboard',
      activeBikeId: 'b1',
      recOpen: false,
      recForm: { typeId: 'oil', date: todayStr(), km: '', shopType: 'self', shopName: '', items: [{ name: '', price: '' }], notes: '', photo: false },
      odoOpen: false,
      odoVal: '',
      profileId: null,
      editForm: null,
      toast: null,
      userName: '',
      onboarded: false,
      onboarding: false,
      draft: this.blankDraft(),
      bikes: [
        {
          id: 'b1', name: 'Yamaha Fazzio', brand: 'Yamaha', model: 'Fazzio 125 Hybrid', year: '2025',
          color: 'Cyan Silver', plate: 'NDP 4821', odo: 8420,
          notes: 'Daily commuter. Slight valve tick noticed at 7,800 km — monitor at next oil change.',
          schedule: this.mkSchedule({ oil: 7800, gear: 5900, cvt: 5000 }),
          history: [
            { id: 1, date: '2025-09-12', km: 1000, typeId: 'oil',  shop: 'Yamaha 3S Caloocan', cost: 380, items: [{ name: 'Yamalube 10W-40', price: 280 }, { name: 'Labor', price: 100 }], parts: 'Yamalube 10W-40', notes: 'Break-in oil change' },
            { id: 2, date: '2025-12-02', km: 2600, typeId: 'oil',  shop: 'Kenny Moto Works', cost: 420, items: [{ name: 'Yamalube Blue Core 10W-40', price: 320 }, { name: 'Labor', price: 100 }], parts: 'Yamalube Blue Core', notes: '' },
            { id: 3, date: '2025-12-20', km: 2900, typeId: 'gear', shop: 'Kenny Moto Works', cost: 180, items: [{ name: 'Yamalube Gear Oil', price: 130 }, { name: 'Labor', price: 50 }], parts: 'Yamalube Gear Oil', notes: '' },
            { id: 4, date: '2026-01-18', km: 4300, typeId: 'oil',  shop: 'Kenny Moto Works', cost: 420, items: [{ name: 'Yamalube Blue Core 10W-40', price: 320 }, { name: 'Labor', price: 100 }], parts: 'Yamalube Blue Core', notes: '' },
            { id: 5, date: '2026-02-08', km: 5000, typeId: 'cvt',  shop: 'Kenny Moto Works', cost: 350, parts: '', notes: 'Cleaned rollers, belt dust removed' },
            { id: 6, date: '2026-03-22', km: 5900, typeId: 'oil',  shop: 'Kenny Moto Works', cost: 420, items: [{ name: 'Yamalube Blue Core 10W-40', price: 320 }, { name: 'Labor', price: 100 }], parts: 'Yamalube Blue Core', notes: '' },
            { id: 7, date: '2026-03-22', km: 5900, typeId: 'gear', shop: 'Kenny Moto Works', cost: 180, items: [{ name: 'Yamalube Gear Oil', price: 130 }, { name: 'Labor', price: 50 }], parts: 'Yamalube Gear Oil', notes: '' },
            { id: 8, date: '2026-06-14', km: 7800, typeId: 'oil',  shop: 'Kenny Moto Works', cost: 420, items: [{ name: 'Yamalube Blue Core 10W-40', price: 320 }, { name: 'Labor', price: 100 }], parts: 'Yamalube Blue Core', notes: 'Slight valve tick, monitor' }
          ]
        },
        {
          id: 'b2', name: 'Honda Click 125i', brand: 'Honda', model: 'Click 125i', year: '2022',
          color: 'Matte Gunpowder Black', plate: 'KLM 2207', odo: 21300,
          notes: '',
          schedule: this.mkSchedule({ oil: 20500, gear: 18400, cvt: 18400, air: 16000, spark: 12000, throttle: 12000, pads: 12000, shoes: 12000, susp: 12000 }),
          history: [
            { id: 1, date: '2025-11-09', km: 16000, typeId: 'air',  shop: 'Honda Prestige Center', cost: 520, items: [{ name: 'Genuine Honda air filter', price: 420 }, { name: 'Labor', price: 100 }], parts: 'Genuine Honda filter', notes: '' },
            { id: 2, date: '2026-04-15', km: 18400, typeId: 'gear', shop: 'Honda Prestige Center', cost: 220, items: [{ name: 'Honda Gear Oil', price: 170 }, { name: 'Labor', price: 50 }], parts: 'Honda Gear Oil', notes: '' },
            { id: 3, date: '2026-04-15', km: 18400, typeId: 'cvt',  shop: 'Honda Prestige Center', cost: 380, parts: '', notes: 'Replaced slider pieces' },
            { id: 4, date: '2026-06-28', km: 20500, typeId: 'oil',  shop: 'Honda Prestige Center', cost: 450, items: [{ name: 'Honda MPX2 10W-30', price: 350 }, { name: 'Labor', price: 100 }], parts: 'Honda MPX2 10W-30', notes: '' }
          ]
        }
      ]
    };
    // the demo garage stays available as opt-in sample data, but a genuinely new
    // rider is greeted and walked through setup instead of inheriting Ken's bikes
    base.sampleBikes = base.bikes;
    base.bikes = [];
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.bikes) && saved.bikes.length) {
        base.bikes = saved.bikes;
        base.activeBikeId = saved.bikes.some(b => b.id === saved.activeBikeId) ? saved.activeBikeId : saved.bikes[0].id;
        base.userName = saved.userName || '';
        base.onboarded = true;
      } else {
        base.screen = 'welcome';
        base.onboarding = true;
        base.userName = (saved && saved.userName) || '';
      }
    } catch { base.screen = 'welcome'; base.onboarding = true; }
    return base;
  }

  componentDidUpdate() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bikes: this.state.bikes, activeBikeId: this.state.activeBikeId, userName: this.state.userName, onboarded: this.state.onboarded }));
    } catch { /* storage full/unavailable */ }
  }

  componentWillUnmount() {
    clearTimeout(this._toastT);
  }

  blankDraft() {
    return {
      name: '', brand: '', model: '', year: '', color: '', plate: '', odo: '', notes: '', kmPerMonth: '',
      items: ITEMS.map(d => ({ id: d.id, name: d.name, emoji: d.emoji, cat: d.cat, interval: d.interval, on: true, mode: 'km', lastKm: '', lastDate: '' }))
    };
  }
  mkSchedule(lastMap) {
    return ITEMS.map(d => ({ ...d, lastKm: lastMap[d.id] ?? 0 }));
  }

  // ── Domain helpers ────────────────────────────────────────────────────────
  bike() { return this.state.bikes.find(b => b.id === this.state.activeBikeId); }
  duePct() { return DUE_SOON_PCT / 100; }
  fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  money(n) { return CURRENCY + Math.round(n).toLocaleString('en-US'); }
  fmtDate(s, withYear) {
    const [y, m, d] = s.split('-').map(Number);
    return MONTHS[m - 1] + ' ' + d + (withYear ? ', ' + y : '');
  }

  statusOf(it, odo) {
    const next = it.lastKm + it.interval;
    const remaining = next - odo;
    const window = it.interval * this.duePct();
    let color, label;
    if (remaining < 0) { color = '#F87171'; label = 'OVERDUE'; }
    else if (remaining <= it.interval * 0.1) { color = '#FB923C'; label = 'ALMOST DUE'; }
    else if (remaining <= window) { color = '#FACC15'; label = 'DUE SOON'; }
    else { color = '#4ADE80'; label = 'ON TRACK'; }
    const usedPct = Math.max(2, Math.min(100, ((odo - it.lastKm) / it.interval) * 100));
    let score;
    if (remaining >= window) score = 100;
    else score = Math.max(0, Math.min(100, 50 + 50 * (remaining / window)));
    return {
      remaining, next, color, label, score,
      pctW: usedPct.toFixed(0) + '%',
      pillBg: color + '22',
      dueTxt: remaining >= 0 ? 'Due in ' + this.fmt(remaining) + ' km' : 'Overdue by ' + this.fmt(-remaining) + ' km'
    };
  }

  healthOf(bike) {
    const sts = bike.schedule.map(it => this.statusOf(it, bike.odo));
    const mean = sts.reduce((a, s) => a + s.score, 0) / Math.max(1, sts.length);
    const overdue = sts.filter(s => s.label === 'OVERDUE').length;
    const almost = sts.filter(s => s.label === 'ALMOST DUE').length;
    const score = Math.round(Math.max(0, Math.min(100, mean - overdue * 12 - almost * 4)));
    let color, label;
    if (score >= 80) { color = '#4ADE80'; label = 'EXCELLENT'; }
    else if (score >= 60) { color = '#FACC15'; label = 'GOOD'; }
    else if (score >= 40) { color = '#FB923C'; label = 'FAIR'; }
    else { color = '#F87171'; label = 'NEEDS ATTENTION'; }
    return { score, color, label, overdue };
  }

  toast(msg) {
    clearTimeout(this._toastT);
    this.setState({ toast: msg });
    this._toastT = setTimeout(() => this.setState({ toast: null }), 2600);
  }

  go(screen) { this.setState({ screen }); }

  // ── Actions ───────────────────────────────────────────────────────────────
  openRec(typeId) {
    const b = this.bike();
    this.setState({
      recOpen: true,
      recForm: { typeId: typeId ?? b.schedule[0].id, date: todayStr(), km: String(b.odo), shopType: 'self', shopName: '', items: [{ name: '', price: '' }], notes: '', photo: false }
    });
  }
  saveRec() {
    const f = this.state.recForm;
    const km = parseInt(f.km, 10);
    if (!km || km <= 0) { this.toast('Enter a valid odometer reading'); return; }
    const items = f.items
      .map(it => ({ name: it.name.trim(), price: parseFloat(it.price) || 0 }))
      .filter(it => it.name || it.price > 0);
    const cost = items.reduce((a, it) => a + it.price, 0);
    const item = this.bike().schedule.find(it => it.id === f.typeId);
    const shopLabels = { self: 'Self Service', casa: 'Casa', shop: 'Shop', other: 'Other' };
    const shop = f.shopType === 'self' ? 'Self Service' : (f.shopName.trim() || shopLabels[f.shopType] || '');
    const entry = { id: Date.now(), date: f.date || todayStr(), km, typeId: f.typeId, shop, shopType: f.shopType, cost, items, parts: items.map(it => it.name).filter(Boolean).join(', '), notes: f.notes };
    this.setState(s => ({
      recOpen: false,
      bikes: s.bikes.map(b => b.id !== s.activeBikeId ? b : {
        ...b,
        odo: Math.max(b.odo, km),
        schedule: b.schedule.map(it => it.id === f.typeId ? { ...it, lastKm: km } : it),
        history: [...b.history, entry]
      })
    }));
    this.toast((item ? item.name : 'Service') + ' logged at ' + this.fmt(km) + ' km — next due at ' + this.fmt(km + (item ? item.interval : 0)) + ' km');
  }

  saveOdo() {
    const v = parseInt(this.state.odoVal, 10);
    if (!v || v <= 0) { this.toast('Enter a valid reading'); return; }
    this.setState(s => ({
      odoOpen: false,
      bikes: s.bikes.map(b => b.id === s.activeBikeId ? { ...b, odo: v } : b)
    }));
    this.toast('Odometer updated to ' + this.fmt(v) + ' km');
  }

  saveBike() {
    const d = this.state.draft;
    if (!d.name.trim()) { this.toast('Give your motorcycle a nickname'); return; }
    const odo = parseInt(d.odo, 10) || 0;
    const kmpm = parseFloat(d.kmPerMonth);
    const needsRate = d.items.some(i => i.on && i.mode === 'date' && i.lastDate);
    if (needsRate && !(kmpm > 0)) { this.toast('Enter your average km per month so dates can be estimated'); return; }
    const bike = {
      id: 'b' + Date.now(),
      name: d.name.trim(), brand: d.brand, model: d.model, year: d.year, color: d.color, plate: d.plate,
      odo, notes: d.notes,
      schedule: d.items.filter(i => i.on).map(i => {
        const interval = Math.max(100, parseInt(i.interval, 10) || 100);
        let lastKm;
        if (i.mode === 'unknown') {
          // don't remember → mark as due now, nudging an inspection
          lastKm = Math.max(0, odo - interval);
        } else if (i.mode === 'date' && i.lastDate) {
          // estimate the odometer at that date from the rider's monthly usage
          const days = Math.max(0, (new Date(todayStr()) - new Date(i.lastDate)) / 86400000);
          lastKm = Math.max(0, Math.min(Math.round(odo - (days / 30.44) * kmpm), odo));
        } else {
          // km mode: blank = cycle starts fresh from the entered odometer; 0 = never serviced
          const lk = parseInt(i.lastKm, 10);
          lastKm = Number.isFinite(lk) ? Math.max(0, Math.min(lk, odo)) : odo;
        }
        return { id: i.id, name: i.name, emoji: i.emoji, cat: i.cat, interval, lastKm };
      }),
      history: []
    };
    if (!bike.schedule.length) { this.toast('Keep at least one maintenance item'); return; }
    const wasOnboarding = this.state.onboarding;
    this.setState(s => ({ bikes: [...s.bikes, bike], activeBikeId: bike.id, screen: 'dashboard', draft: this.blankDraft(), onboarded: true, onboarding: false }));
    const who = this.state.userName.trim();
    this.toast(wasOnboarding
      ? 'Welcome aboard' + (who ? ', ' + who : '') + '! ' + bike.name + ' is set up.'
      : bike.name + ' added to your garage');
  }

  loadSample() {
    this.setState(s => ({ bikes: s.sampleBikes, activeBikeId: 'b1', screen: 'dashboard', onboarded: true, onboarding: false }));
    this.toast('Loaded a sample garage — explore away');
  }

  openEdit(bikeId) {
    const bk = this.state.bikes.find(x => x.id === bikeId);
    if (!bk) return;
    this.setState({
      screen: 'editBike',
      editForm: {
        id: bk.id, name: bk.name, brand: bk.brand || '', model: bk.model || '',
        year: bk.year || '', color: bk.color || '', plate: bk.plate || '',
        odo: String(bk.odo), notes: bk.notes || ''
      }
    });
  }
  saveEdit() {
    const f = this.state.editForm;
    if (!f) return;
    if (!f.name.trim()) { this.toast('Give your motorcycle a nickname'); return; }
    const odo = parseInt(f.odo, 10) || 0;
    this.setState(s => ({
      screen: 'profile',
      editForm: null,
      bikes: s.bikes.map(b => b.id !== f.id ? b : {
        ...b,
        name: f.name.trim(), brand: f.brand, model: f.model, year: f.year,
        color: f.color, plate: f.plate, odo: Math.max(0, odo), notes: f.notes
      })
    }));
    this.toast('Details updated');
  }

  monthBuckets(history) {
    const now = new Date(todayStr());
    const out = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      const amount = history.filter(h => h.date.startsWith(key)).reduce((a, h) => a + h.cost, 0);
      out.push({ label: MONTHS[d.getMonth()].toUpperCase(), key, amount });
    }
    return out;
  }

  // ── View-model (ported verbatim from the design's renderVals) ─────────────
  renderVals() {
    const s = this.state;
    // synthetic empty bike keeps the view-model safe during onboarding (no bikes yet)
    const b = this.bike() || { id: '', name: '', brand: '', model: '', year: '', color: '', plate: '', odo: 0, notes: '', schedule: [], history: [] };
    const odo = b.odo;
    const health = this.healthOf(b);
    const itemById = Object.fromEntries(ITEMS.map(i => [i.id, i]));

    // most recent logged service per item, to date-stamp the "last done" line
    const lastDateByType = {};
    b.history.forEach(h => {
      const cur = lastDateByType[h.typeId];
      if (!cur || h.km > cur.km || (h.km === cur.km && h.date > cur.date)) lastDateByType[h.typeId] = { km: h.km, date: h.date };
    });
    const rows = b.schedule.map(it => {
      const st = this.statusOf(it, odo);
      const ld = lastDateByType[it.id];
      const lastDoneTxt = it.lastKm > 0
        ? 'Last at ' + this.fmt(it.lastKm) + ' km' + (ld && ld.km === it.lastKm ? ' · ' + this.fmtDate(ld.date) : '')
        : 'Not yet serviced';
      return {
        id: it.id, emoji: it.emoji, name: it.name,
        intervalTxt: 'Every ' + this.fmt(it.interval) + ' km',
        lastTxt: lastDoneTxt,
        color: st.color, pillBg: st.pillBg, statusLabel: st.label, dueTxt: st.dueTxt, pctW: st.pctW,
        nextTxt: st.remaining >= 0 ? 'Next at ' + this.fmt(st.next) + ' km' : 'Was due at ' + this.fmt(st.next) + ' km',
        remaining: st.remaining,
        onLog: () => this.openRec(it.id)
      };
    });
    const upcoming = [...rows].sort((a, x) => a.remaining - x.remaining).slice(0, 4);
    const onTrack = rows.filter(r => r.statusLabel === 'ON TRACK').length;

    // history
    const historyRows = [...b.history].sort((a, x) => x.km - a.km || (x.date < a.date ? -1 : 1)).map(h => {
      const it = itemById[h.typeId] || { name: 'Service', emoji: '🔧' };
      return {
        id: h.id, typeId: h.typeId, emoji: it.emoji, name: it.name,
        dateTxt: this.fmtDate(h.date, true), shop: h.shop || '—',
        costTxt: this.money(h.cost), kmTxt: this.fmt(h.km) + ' KM',
        items: (h.items || []).map(it => ({ name: it.name, priceTxt: this.money(it.price) })),
        hasItems: !!(h.items && h.items.length),
        parts: h.parts, hasParts: !!h.parts && !(h.items && h.items.length),
        notes: h.notes, hasNotes: !!h.notes
      };
    });
    const lifetimeCost = b.history.reduce((a, h) => a + h.cost, 0);
    const lastEntry = [...b.history].sort((a, x) => (x.date < a.date ? -1 : 1))[0];

    // expenses
    const now = new Date(todayStr());
    const yearKey = String(now.getFullYear());
    const monthKey = yearKey + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const yearCost = b.history.filter(h => h.date.startsWith(yearKey)).reduce((a, h) => a + h.cost, 0);
    const monthCost = b.history.filter(h => h.date.startsWith(monthKey)).reduce((a, h) => a + h.cost, 0);
    const buckets = this.monthBuckets(b.history);
    const maxAmt = Math.max(1, ...buckets.map(x => x.amount));
    const monthBars = buckets.map(x => ({
      label: x.label, key: x.key,
      amountTxt: x.amount ? this.money(x.amount) : '—',
      amtColor: x.amount ? '#EDF1F6' : '#4A5462',
      barColor: x.amount ? (x.amount === maxAmt ? '#38BDF8' : 'rgba(56,189,248,0.4)') : 'rgba(255,255,255,0.06)',
      h: x.amount ? Math.max(8, Math.round((x.amount / maxAmt) * 62)) : 4
    }));
    const byType = {};
    b.history.forEach(h => { byType[h.typeId] = (byType[h.typeId] || 0) + h.cost; });
    const topType = Object.entries(byType).sort((a, x) => x[1] - a[1])[0];
    const prodAgg = {};
    b.history.forEach(h => (h.items || []).forEach(it => {
      const name = (it.name || '').trim();
      if (!name || !(it.price > 0)) return;
      const k = name.toLowerCase();
      if (!prodAgg[k]) prodAgg[k] = { name, total: 0, count: 0 };
      prodAgg[k].total += it.price;
      prodAgg[k].count += 1;
    }));
    const topProducts = Object.values(prodAgg).sort((a, x) => x.total - a.total).slice(0, 5)
      .map(p => ({ name: p.name, totalTxt: this.money(p.total), countTxt: p.count + (p.count === 1 ? ' purchase' : ' purchases') }));

    // health categories
    const healthCats = CATS.map(c => {
      const items = b.schedule.filter(it => it.cat === c.name);
      if (!items.length) return null;
      const avg = Math.round(items.reduce((a, it) => a + this.statusOf(it, odo).score, 0) / items.length);
      let color;
      if (avg >= 80) color = '#4ADE80'; else if (avg >= 60) color = '#FACC15'; else if (avg >= 40) color = '#FB923C'; else color = '#F87171';
      return { name: c.name, emoji: c.emoji, pctTxt: avg + '%', wTxt: avg + '%', color, itemsTxt: items.length + (items.length === 1 ? ' item' : ' items') };
    }).filter(Boolean);

    // garage
    const bikeCards = s.bikes.map(bk => {
      const h = this.healthOf(bk);
      return {
        id: bk.id, name: bk.name,
        sub: [bk.year, bk.model, bk.plate].filter(Boolean).join(' · '),
        odoTxt: this.fmt(bk.odo) + ' km', healthTxt: h.score + '%', healthColor: h.color,
        isActive: bk.id === s.activeBikeId, notActive: bk.id !== s.activeBikeId,
        borderC: bk.id === s.activeBikeId ? 'rgba(56,189,248,0.35)' : 'rgba(255,255,255,0.07)',
        onSelect: () => { this.setState({ activeBikeId: bk.id, screen: 'dashboard' }); this.toast('Switched to ' + bk.name); },
        onOpen: () => this.setState({ profileId: bk.id, screen: 'profile' })
      };
    });

    // profile
    const pb = s.bikes.find(x => x.id === s.profileId) || b;
    const ph = this.healthOf(pb);
    const profileFields = [
      { label: 'BRAND', value: pb.brand || '—' },
      { label: 'MODEL', value: pb.model || '—' },
      { label: 'YEAR', value: pb.year || '—' },
      { label: 'COLOR', value: pb.color || '—' },
      { label: 'PLATE NUMBER', value: pb.plate || '—' },
      { label: 'ODOMETER', value: this.fmt(pb.odo) + ' km' },
      { label: 'MAINTENANCE ITEMS', value: String(pb.schedule.length) }
    ];

    // add-bike draft
    const setDraftItem = (id, patch) =>
      this.setState(st => ({ draft: { ...st.draft, items: st.draft.items.map(i => i.id === id ? { ...i, ...patch } : i) } }));
    const draftRows = s.draft.items.map(d => ({
      id: d.id, emoji: d.emoji, name: d.name, interval: d.interval, on: d.on,
      mode: d.mode, lastKm: d.lastKm, lastDate: d.lastDate,
      rowOpacity: d.on ? '1' : '0.4',
      trackBg: d.on ? '#38BDF8' : 'rgba(255,255,255,0.14)',
      knobLeft: d.on ? '20px' : '3px',
      toggle: () => setDraftItem(d.id, { on: !d.on }),
      setMode: (m) => setDraftItem(d.id, { mode: m }),
      onInterval: (e) => setDraftItem(d.id, { interval: e.target.value }),
      onLastKm: (e) => setDraftItem(d.id, { lastKm: e.target.value }),
      onLastDate: (e) => setDraftItem(d.id, { lastDate: e.target.value })
    }));

    // record items editor
    const recItems = s.recForm.items.map((it, idx) => ({
      name: it.name, price: it.price, idx,
      canRemove: s.recForm.items.length > 1,
      onName: (e) => { const val = e.target.value; this.setState(st => ({ recForm: { ...st.recForm, items: st.recForm.items.map((x, i) => i === idx ? { ...x, name: val } : x) } })); },
      onPrice: (e) => { const val = e.target.value; this.setState(st => ({ recForm: { ...st.recForm, items: st.recForm.items.map((x, i) => i === idx ? { ...x, price: val } : x) } })); },
      onRemove: () => this.setState(st => ({ recForm: { ...st.recForm, items: st.recForm.items.filter((_, i) => i !== idx) } }))
    }));
    const recTotal = s.recForm.items.reduce((a, it) => a + (parseFloat(it.price) || 0), 0);

    // record preview
    const recItem = b.schedule.find(it => it.id === s.recForm.typeId);
    const recKm = parseInt(s.recForm.km, 10);
    const recPreviewTxt = recItem && recKm
      ? 'Next ' + recItem.name.toLowerCase() + ' will be due at ' + this.fmt(recKm + recItem.interval) + ' km.'
      : 'Next due mileage is calculated automatically after saving.';

    const scr = s.screen;
    const tabC = (name) => scr === name ? '#38BDF8' : '#6B7684';
    const ringC = 2 * Math.PI * 44, ringCB = 2 * Math.PI * 64;

    return {
      // identity
      bikeName: b.name, bikeNameUpper: b.name.toUpperCase(),
      bikeSub: [b.year, b.model].filter(Boolean).join(' · '), bikePlate: b.plate || '—',
      odoFmt: this.fmt(odo),
      currencySym: CURRENCY,
      // health
      healthScore: health.score, healthColor: health.color, healthLabel: health.label,
      ringDash: (health.score / 100 * ringC).toFixed(1) + ' ' + ringC.toFixed(1),
      ringDashBig: (health.score / 100 * ringCB).toFixed(1) + ' ' + ringCB.toFixed(1),
      healthSubTxt: health.overdue ? health.overdue + (health.overdue === 1 ? ' item is overdue' : ' items are overdue') : 'No overdue items',
      healthCats,
      // dashboard
      segments: rows.map(r => ({ color: r.color })),
      onTrackTxt: onTrack + ' of ' + rows.length + ' on track',
      upcoming,
      lifetimeCostTxt: this.money(lifetimeCost),
      lastServiceTxt: lastEntry ? this.fmtDate(lastEntry.date) : '—',
      servicesCount: b.history.length,
      // schedule
      scheduleRows: rows,
      // history
      historyRows,
      historySummary: b.history.length + ' services · ' + this.money(lifetimeCost) + ' lifetime',
      // expenses
      monthCostTxt: this.money(monthCost), yearCostTxt: this.money(yearCost),
      monthBars,
      topSpendName: topType ? (itemById[topType[0]] || {}).name || '—' : '—',
      topSpendTxt: topType ? this.money(topType[1]) : '—',
      topProducts, hasTopProducts: topProducts.length > 0,
      avgServiceTxt: b.history.length ? this.money(lifetimeCost / b.history.length) : '—',
      costPerKmTxt: odo > 0 ? CURRENCY + (lifetimeCost / odo).toFixed(2) + '/km' : '—',
      // garage / profile
      bikeCards,
      profileName: pb.name, profileSub: [pb.year, pb.model].filter(Boolean).join(' · '),
      profileFields, profileNotes: pb.notes, profileHasNotes: !!pb.notes,
      profileServices: pb.history.length,
      profileSpent: this.money(pb.history.reduce((a, h) => a + h.cost, 0)),
      profileHealth: ph.score + '%', profileHealthColor: ph.color,
      profileNotActive: pb.id !== s.activeBikeId,
      profileSetActive: () => { this.setState({ activeBikeId: pb.id, screen: 'dashboard' }); this.toast('Switched to ' + pb.name); },
      profileEdit: () => this.openEdit(pb.id),
      // edit bike details
      editForm: s.editForm || {},
      onEditInput: (e) => { const { name, value } = e.target; this.setState(st => ({ editForm: { ...st.editForm, [name]: value } })); },
      saveEdit: () => this.saveEdit(),
      cancelEdit: () => this.setState({ screen: 'profile', editForm: null }),
      // add bike
      draft: s.draft, draftRows,
      onDraftInput: (e) => { const { name, value } = e.target; this.setState(st => ({ draft: { ...st.draft, [name]: value } })); },
      saveBike: () => this.saveBike(),
      // record
      recOpen: s.recOpen, recForm: s.recForm,
      recItems, recTotalTxt: this.money(recTotal),
      addRecItem: () => this.setState(st => ({ recForm: { ...st.recForm, items: [...st.recForm.items, { name: '', price: '' }] } })),
      typeOptions: b.schedule.map(it => ({ id: it.id, label: it.name })),
      onRecInput: (e) => { const { name, value } = e.target; this.setState(st => ({ recForm: { ...st.recForm, [name]: value } })); },
      togglePhoto: () => this.setState(st => ({ recForm: { ...st.recForm, photo: !st.recForm.photo } })),
      photoLabel: s.recForm.photo ? 'receipt-' + todayStr() + '.jpg attached — tap to remove' : 'Add receipt or photo',
      photoColor: s.recForm.photo ? '#4ADE80' : '#8A94A3',
      recPreviewTxt,
      saveRec: () => this.saveRec(),
      openRecBlank: () => this.openRec(null),
      closeRec: () => this.setState({ recOpen: false }),
      // odometer
      odoOpen: s.odoOpen, odoVal: s.odoVal,
      openOdo: () => this.setState({ odoOpen: true, odoVal: String(odo) }),
      closeOdo: () => this.setState({ odoOpen: false }),
      onOdoInput: (e) => this.setState({ odoVal: e.target.value }),
      saveOdo: () => this.saveOdo(),
      // toast
      hasToast: !!s.toast, toastMsg: s.toast,
      // onboarding
      onboarding: s.onboarding,
      userName: s.userName,
      garageTitle: s.userName.trim() ? s.userName.trim() + '’s Garage' : 'Garage',
      onNameInput: (e) => this.setState({ userName: e.target.value }),
      startSetup: () => {
        if (!s.userName.trim()) { this.toast('Please tell us your name first'); return; }
        this.setState({ screen: 'addBike', onboarding: true, draft: this.blankDraft() });
      },
      backToWelcome: () => this.setState({ screen: 'welcome' }),
      loadSample: () => this.loadSample(),
      // nav
      isDash: scr === 'dashboard', isSchedule: scr === 'schedule', isHistory: scr === 'history',
      isExpenses: scr === 'expenses', isGarage: scr === 'garage', isHealth: scr === 'health',
      isProfile: scr === 'profile', isAddBike: scr === 'addBike', isEditBike: scr === 'editBike',
      isWelcome: scr === 'welcome',
      fabOn: ['dashboard', 'schedule', 'history'].includes(scr) && !s.recOpen,
      goDash: () => this.go('dashboard'), goSchedule: () => this.go('schedule'),
      goHistory: () => this.go('history'), goExpenses: () => this.go('expenses'),
      goGarage: () => this.go('garage'), goHealth: () => this.go('health'),
      goAddBike: () => this.setState({ screen: 'addBike', draft: this.blankDraft() }),
      tabDashC: tabC('dashboard'), tabSchedC: tabC('schedule'), tabHistC: tabC('history'),
      tabExpC: tabC('expenses'), tabGarC: ['garage', 'profile', 'addBike', 'editBike'].includes(scr) ? '#38BDF8' : '#6B7684'
    };
  }

  // ── Screens ───────────────────────────────────────────────────────────────
  renderDash(v) {
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(70px,calc(env(safe-area-inset-top) + 24px)) 20px 16px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px;')}>
          <div>
            <div style={sx('display:flex;align-items:center;gap:8px;')}>
              <LogoMark size={20} />
              <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;color:#38BDF8;")}>KEN'S MOTOCARE</span>
            </div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:700;line-height:1.05;letter-spacing:0.5px;margin-top:4px;")}>{v.bikeName}</div>
            <div style={sx('font-size:13px;color:#8A94A3;margin-top:2px;')}>{v.bikeSub}</div>
          </div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:4px 8px;")}>{v.bikePlate}</div>
        </div>

        <div style={sx('margin:4px 16px 0;background:var(--card-hero);box-shadow:var(--card-shadow);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:18px 18px 16px;display:flex;align-items:center;gap:14px;')}>
          <div style={sx('flex:1;min-width:0;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;color:#8A94A3;")}>ODOMETER</div>
            <div style={sx('display:flex;align-items:baseline;gap:6px;margin-top:2px;')}>
              <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:44px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:1px;")}>{v.odoFmt}</span>
              <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:600;color:#8A94A3;letter-spacing:1px;")}>KM</span>
            </div>
            <button onClick={v.openOdo} className="hovA" style={sx("margin-top:12px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);color:#38BDF8;border-radius:9px;padding:7px 14px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;letter-spacing:1.5px;cursor:pointer;")}>UPDATE</button>
          </div>
          <button onClick={v.goHealth} style={sx('background:none;border:none;padding:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;')} aria-label="Health breakdown">
            <div style={sx('position:relative;width:104px;height:104px;')}>
              <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', background: 'radial-gradient(circle, ' + v.healthColor + '30 0%, transparent 62%)', filter: 'blur(5px)', pointerEvents: 'none' }}></div>
              <svg width="104" height="104" viewBox="0 0 104 104">
                <circle cx="52" cy="52" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"></circle>
                <circle cx="52" cy="52" r="44" fill="none" stroke={v.healthColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={v.ringDash} transform="rotate(-90 52 52)" style={sx('transition:stroke-dasharray .6s ease;')}></circle>
              </svg>
              <div style={sx('position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;')}>
                <span style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;line-height:1;"), color: v.healthColor }}>{v.healthScore}</span>
                <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;color:#8A94A3;")}>HEALTH</span>
              </div>
            </div>
            <span style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;"), color: v.healthColor }}>{v.healthLabel}</span>
          </button>
        </div>

        <div style={sx('margin:12px 16px 0;padding:14px 18px;background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;')}>
          <div style={sx('display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;')}>
            <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;color:#8A94A3;")}>MAINTENANCE STATUS</span>
            <span style={sx('font-size:12px;color:#8A94A3;font-variant-numeric:tabular-nums;')}>{v.onTrackTxt}</span>
          </div>
          <div style={sx('display:flex;gap:3px;')}>
            {v.segments.map((seg, i) => (
              <div key={i} style={{ ...sx('flex:1;height:5px;border-radius:3px;'), background: seg.color }}></div>
            ))}
          </div>
        </div>

        <div style={sx('display:flex;align-items:baseline;justify-content:space-between;padding:22px 20px 10px;')}>
          <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;letter-spacing:2.5px;color:#EDF1F6;")}>UP NEXT</span>
          <button onClick={v.goSchedule} style={sx('background:none;border:none;color:#38BDF8;font-size:13px;font-weight:500;cursor:pointer;padding:0;')}>See all</button>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:8px;margin:0 16px;')}>
          {v.upcoming.map((u, i) => (
            <div key={u.id} className="riseIn" style={{ ...sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;padding:13px 14px;display:flex;align-items:center;gap:12px;'), animationDelay: (i * 55) + 'ms' }}>
              <div style={{ ...sx('width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;'), background: u.pillBg, color: u.color }}><ItemIcon id={u.id} /></div>
              <div style={sx('flex:1;min-width:0;')}>
                <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:8px;')}>
                  <span style={sx('font-size:15px;font-weight:600;')}>{u.name}</span>
                  <span style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;border-radius:5px;padding:3px 7px;"), color: u.color, background: u.pillBg, border: '1px solid ' + u.color + '3A' }}>{u.statusLabel}</span>
                </div>
                <div style={sx('font-size:11.5px;color:#8A94A3;margin-top:2px;font-variant-numeric:tabular-nums;')}>{u.lastTxt}</div>
                <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:3px;')}>
                  <div style={sx('display:flex;flex-direction:column;min-width:0;')}>
                    <span style={sx('font-size:12.5px;font-weight:600;color:#EDF1F6;font-variant-numeric:tabular-nums;')}>{u.nextTxt}</span>
                    <span style={sx('font-size:11px;color:#8A94A3;font-variant-numeric:tabular-nums;margin-top:1px;')}>{u.dueTxt}</span>
                  </div>
                  <button onClick={u.onLog} className="hovB" style={sx("background:none;border:1px solid rgba(255,255,255,0.14);color:#EDF1F6;border-radius:7px;padding:4px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;cursor:pointer;")}>LOG</button>
                </div>
                <div style={sx('height:3px;border-radius:2px;background:rgba(255,255,255,0.07);margin-top:9px;overflow:hidden;')}>
                  <div style={{ ...sx('height:100%;border-radius:2px;transition:width .6s cubic-bezier(.16,1,.3,1);'), background: u.color, width: u.pctW }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={sx('display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:16px 16px 8px;')}>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>TOTAL SPENT</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:700;margin-top:3px;font-variant-numeric:tabular-nums;")}>{v.lifetimeCostTxt}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>LAST SERVICE</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:700;margin-top:3px;")}>{v.lastServiceTxt}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>SERVICES</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:700;margin-top:3px;font-variant-numeric:tabular-nums;")}>{v.servicesCount}</div>
          </div>
        </div>
      </div>
    );
  }

  renderSchedule(v) {
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(70px,calc(env(safe-area-inset-top) + 24px)) 20px 14px;')}>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;color:#38BDF8;")}>{v.bikeNameUpper}</div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.5px;margin-top:2px;")}>Maintenance Schedule</div>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:8px;margin:0 16px;')}>
          {v.scheduleRows.map((r, i) => (
            <div key={r.id} className="riseIn" style={{ ...sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;padding:13px 14px;'), animationDelay: (i * 45) + 'ms' }}>
              <div style={sx('display:flex;align-items:center;gap:12px;')}>
                <div style={{ ...sx('width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;'), background: r.pillBg, color: r.color }}><ItemIcon id={r.id} /></div>
                <div style={sx('flex:1;min-width:0;')}>
                  <div style={sx('font-size:15px;font-weight:600;')}>{r.name}</div>
                  <div style={sx('font-size:12px;color:#8A94A3;margin-top:1px;')}>{r.intervalTxt} · {r.lastTxt}</div>
                </div>
                <div style={sx('display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0;')}>
                  <span style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;border-radius:5px;padding:3px 7px;"), color: r.color, background: r.pillBg, border: '1px solid ' + r.color + '3A' }}>{r.statusLabel}</span>
                  <button onClick={r.onLog} className="hovB" style={sx("background:none;border:1px solid rgba(255,255,255,0.14);color:#EDF1F6;border-radius:7px;padding:4px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;cursor:pointer;")}>LOG</button>
                </div>
              </div>
              <div style={sx('display:flex;align-items:center;gap:10px;margin-top:10px;')}>
                <div style={sx('flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,0.07);overflow:hidden;')}>
                  <div style={{ ...sx('height:100%;border-radius:2px;transition:width .6s cubic-bezier(.16,1,.3,1);'), background: r.color, width: r.pctW }}></div>
                </div>
                <div style={sx('display:flex;flex-direction:column;align-items:flex-end;white-space:nowrap;flex-shrink:0;')}>
                  <span style={sx('font-size:12.5px;font-weight:600;color:#EDF1F6;font-variant-numeric:tabular-nums;')}>{r.nextTxt}</span>
                  <span style={sx('font-size:11px;color:#8A94A3;font-variant-numeric:tabular-nums;margin-top:1px;')}>{r.dueTxt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderHistory(v) {
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(70px,calc(env(safe-area-inset-top) + 24px)) 20px 14px;')}>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;color:#38BDF8;")}>{v.bikeNameUpper}</div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.5px;margin-top:2px;")}>History</div>
          <div style={sx('font-size:13px;color:#8A94A3;margin-top:2px;')}>{v.historySummary}</div>
        </div>
        <div style={sx('margin:0 16px 0 26px;border-left:2px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:10px;padding:4px 0 8px;')}>
          {v.historyRows.map((h, i) => (
            <div key={h.id} className="riseIn" style={{ ...sx('position:relative;margin-left:16px;background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px 14px;'), animationDelay: (i * 45) + 'ms' }}>
              <div style={sx('position:absolute;left:-23px;top:18px;width:10px;height:10px;border-radius:5px;background:#38BDF8;border:2px solid #0B0E13;box-shadow:0 0 8px rgba(56,189,248,0.6);')}></div>
              <div style={sx('display:flex;align-items:center;gap:10px;')}>
                <span style={sx('color:#7DD3FC;flex-shrink:0;')}><ItemIcon id={h.typeId} size={18} /></span>
                <div style={sx('flex:1;min-width:0;')}>
                  <div style={sx('font-size:14.5px;font-weight:600;')}>{h.name}</div>
                  <div style={sx('font-size:12px;color:#8A94A3;margin-top:1px;')}>{h.dateTxt} · {h.shop}</div>
                </div>
                <div style={sx('text-align:right;flex-shrink:0;')}>
                  <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;font-variant-numeric:tabular-nums;")}>{h.costTxt}</div>
                  <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:1px;color:#8A94A3;font-variant-numeric:tabular-nums;")}>{h.kmTxt}</div>
                </div>
              </div>
              {h.hasItems && (
                <div style={sx('margin-top:8px;background:rgba(255,255,255,0.04);border-radius:9px;padding:7px 10px;display:flex;flex-direction:column;gap:4px;')}>
                  {h.items.map((it, i) => (
                    <div key={i} style={sx('display:flex;justify-content:space-between;gap:10px;font-size:12px;')}>
                      <span style={sx('color:#8A94A3;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;')}>{it.name || 'Item'}</span>
                      <span style={sx('color:#B7C0CC;font-variant-numeric:tabular-nums;flex-shrink:0;')}>{it.priceTxt}</span>
                    </div>
                  ))}
                </div>
              )}
              {h.hasParts && (
                <div style={sx('margin-top:8px;font-size:12px;color:#8A94A3;background:rgba(255,255,255,0.04);border-radius:7px;padding:5px 9px;display:inline-block;')}>{h.parts}</div>
              )}
              {h.hasNotes && (
                <div style={sx('margin-top:6px;font-size:12.5px;color:#B7C0CC;font-style:italic;')}>“{h.notes}”</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderExpenses(v) {
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(70px,calc(env(safe-area-inset-top) + 24px)) 20px 14px;')}>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;color:#38BDF8;")}>{v.bikeNameUpper}</div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.5px;margin-top:2px;")}>Expenses</div>
        </div>
        <div style={sx('display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:0 16px;')}>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>THIS MONTH</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:700;margin-top:3px;font-variant-numeric:tabular-nums;")}>{v.monthCostTxt}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>THIS YEAR</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:700;margin-top:3px;font-variant-numeric:tabular-nums;")}>{v.yearCostTxt}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--accent-line);box-shadow:var(--card-shadow),0 0 22px -8px rgba(56,189,248,0.35);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#38BDF8;")}>LIFETIME</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:21px;font-weight:700;margin-top:3px;color:#38BDF8;font-variant-numeric:tabular-nums;")}>{v.lifetimeCostTxt}</div>
          </div>
        </div>
        <div style={sx('margin:12px 16px 0;background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;padding:16px;')}>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;color:#8A94A3;margin-bottom:14px;")}>MONTHLY EXPENSES</div>
          <div style={sx('display:flex;align-items:flex-end;gap:10px;height:110px;')}>
            {v.monthBars.map(m => (
              <div key={m.key} style={sx('flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;')}>
                <span style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;"), color: m.amtColor }}>{m.amountTxt}</span>
                <div style={{ ...sx('width:100%;max-width:30px;border-radius:6px 6px 3px 3px;transition:height .5s ease;'), background: m.barColor, height: m.h + 'px' }}></div>
                <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:1px;color:#8A94A3;")}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
        {v.hasTopProducts && (
          <div style={sx('margin:12px 16px 0;background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;padding:16px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;color:#8A94A3;margin-bottom:10px;")}>SPENDING BY PRODUCT</div>
            <div style={sx('display:flex;flex-direction:column;gap:9px;')}>
              {v.topProducts.map(p => (
                <div key={p.name} style={sx('display:flex;justify-content:space-between;align-items:baseline;gap:10px;')}>
                  <div style={sx('min-width:0;')}>
                    <div style={sx('font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;')}>{p.name}</div>
                    <div style={sx('font-size:11px;color:#8A94A3;')}>{p.countTxt}</div>
                  </div>
                  <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;font-variant-numeric:tabular-nums;flex-shrink:0;")}>{p.totalTxt}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={sx('display:flex;flex-direction:column;gap:8px;margin:12px 16px 8px;')}>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:13px 16px;display:flex;justify-content:space-between;align-items:center;')}>
            <div>
              <div style={sx('font-size:13px;color:#8A94A3;')}>Most expensive maintenance</div>
              <div style={sx('font-size:15px;font-weight:600;margin-top:2px;')}>{v.topSpendName}</div>
            </div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;")}>{v.topSpendTxt}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:13px 16px;display:flex;justify-content:space-between;align-items:center;')}>
            <div style={sx('font-size:13px;color:#8A94A3;')}>Average per service</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;")}>{v.avgServiceTxt}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:13px 16px;display:flex;justify-content:space-between;align-items:center;')}>
            <div style={sx('font-size:13px;color:#8A94A3;')}>Cost per kilometer</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;")}>{v.costPerKmTxt}</div>
          </div>
        </div>
      </div>
    );
  }

  renderHealth(v) {
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(64px,calc(env(safe-area-inset-top) + 18px)) 16px 6px;')}>
          <button onClick={v.goDash} style={sx('background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#EDF1F6;border-radius:10px;padding:7px 12px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px;')}>
            <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            Back
          </button>
        </div>
        <div style={sx('display:flex;flex-direction:column;align-items:center;padding:10px 20px 6px;')}>
          <div style={sx('position:relative;width:150px;height:150px;')}>
            <div style={{ position: 'absolute', inset: '-18px', borderRadius: '50%', background: 'radial-gradient(circle, ' + v.healthColor + '30 0%, transparent 62%)', filter: 'blur(7px)', pointerEvents: 'none' }}></div>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"></circle>
              <circle cx="75" cy="75" r="64" fill="none" stroke={v.healthColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={v.ringDashBig} transform="rotate(-90 75 75)" style={sx('transition:stroke-dasharray .6s ease;')}></circle>
            </svg>
            <div style={sx('position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;')}>
              <span style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:46px;font-weight:700;line-height:1;"), color: v.healthColor }}>{v.healthScore}</span>
              <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;color:#8A94A3;")}>HEALTH</span>
            </div>
          </div>
          <div style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:1px;margin-top:8px;"), color: v.healthColor }}>{v.healthLabel}</div>
          <div style={sx('font-size:13px;color:#8A94A3;margin-top:2px;')}>{v.healthSubTxt}</div>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:8px;margin:14px 16px;')}>
          {v.healthCats.map((c, i) => (
            <div key={c.name} className="riseIn" style={{ ...sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:12px;'), animationDelay: (i * 45) + 'ms' }}>
              <div style={{ ...sx('width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;flex-shrink:0;'), color: c.color }}><CatIcon name={c.name} /></div>
              <div style={sx('flex:1;min-width:0;')}>
                <div style={sx('display:flex;justify-content:space-between;align-items:baseline;')}>
                  <span style={sx('font-size:14.5px;font-weight:600;')}>{c.name}</span>
                  <span style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;font-variant-numeric:tabular-nums;"), color: c.color }}>{c.pctTxt}</span>
                </div>
                <div style={sx('display:flex;align-items:center;gap:8px;margin-top:6px;')}>
                  <div style={sx('flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,0.07);overflow:hidden;')}>
                    <div style={{ ...sx('height:100%;border-radius:2px;transition:width .6s cubic-bezier(.16,1,.3,1);'), background: c.color, width: c.wTxt }}></div>
                  </div>
                  <span style={sx('font-size:11px;color:#8A94A3;white-space:nowrap;')}>{c.itemsTxt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderGarage(v) {
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(70px,calc(env(safe-area-inset-top) + 24px)) 20px 14px;')}>
          <div style={sx('display:flex;align-items:center;gap:8px;')}>
            <LogoMark size={20} />
            <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;color:#38BDF8;")}>KEN'S MOTOCARE</span>
          </div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.5px;margin-top:2px;")}>{v.garageTitle}</div>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:10px;margin:0 16px;')}>
          {v.bikeCards.map(b => (
            <div key={b.id} style={{ ...sx('background:var(--card-hero);box-shadow:var(--card-shadow);border-radius:18px;padding:16px;'), border: '1px solid ' + b.borderC }}>
              <div style={sx('display:flex;align-items:flex-start;justify-content:space-between;gap:10px;')}>
                <button onClick={b.onOpen} style={sx('background:none;border:none;padding:0;text-align:left;cursor:pointer;color:#EDF1F6;flex:1;min-width:0;')}>
                  <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;letter-spacing:0.5px;")}>{b.name}</div>
                  <div style={sx('font-size:12.5px;color:#8A94A3;margin-top:2px;')}>{b.sub}</div>
                </button>
                {b.isActive && (
                  <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#38BDF8;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);border-radius:6px;padding:4px 8px;flex-shrink:0;")}>ACTIVE</span>
                )}
              </div>
              <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;')}>
                <div style={sx('display:flex;gap:16px;')}>
                  <div>
                    <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>ODOMETER</div>
                    <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;")}>{b.odoTxt}</div>
                  </div>
                  <div>
                    <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>HEALTH</div>
                    <div style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;"), color: b.healthColor }}>{b.healthTxt}</div>
                  </div>
                </div>
                <div style={sx('display:flex;gap:8px;')}>
                  <button onClick={b.onOpen} className="hovB" style={sx("background:none;border:1px solid rgba(255,255,255,0.14);color:#EDF1F6;border-radius:9px;padding:7px 12px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:1.5px;cursor:pointer;")}>DETAILS</button>
                  {b.notActive && (
                    <button onClick={b.onSelect} className="hovA" style={sx("background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.35);color:#38BDF8;border-radius:9px;padding:7px 12px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:1.5px;cursor:pointer;")}>SWITCH</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button onClick={v.goAddBike} className="hovB" style={sx("background:none;border:1.5px dashed rgba(255,255,255,0.18);color:#8A94A3;border-radius:18px;padding:18px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:600;letter-spacing:2px;cursor:pointer;")}>+ ADD MOTORCYCLE</button>
        </div>
      </div>
    );
  }

  renderProfile(v) {
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(64px,calc(env(safe-area-inset-top) + 18px)) 16px 6px;')}>
          <button onClick={v.goGarage} style={sx('background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#EDF1F6;border-radius:10px;padding:7px 12px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px;')}>
            <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            Garage
          </button>
        </div>
        <div style={sx('padding:8px 20px 14px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;')}>
          <div style={sx('min-width:0;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.5px;")}>{v.profileName}</div>
            <div style={sx('font-size:13px;color:#8A94A3;margin-top:2px;')}>{v.profileSub}</div>
          </div>
          <button onClick={v.profileEdit} className="hovB" style={sx("background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#EDF1F6;border-radius:10px;padding:8px 13px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:1.5px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;gap:6px;")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0L4 16z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"></path></svg>
            EDIT
          </button>
        </div>
        <div style={sx('margin:0 16px;background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;overflow:hidden;')}>
          {v.profileFields.map(f => (
            <div key={f.label} style={sx('display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.05);')}>
              <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;color:#8A94A3;")}>{f.label}</span>
              <span style={sx('font-size:14.5px;font-weight:500;')}>{f.value}</span>
            </div>
          ))}
        </div>
        {v.profileHasNotes && (
          <div style={sx('margin:10px 16px 0;background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;padding:13px 16px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;color:#8A94A3;margin-bottom:4px;")}>NOTES</div>
            <div style={sx('font-size:13.5px;color:#B7C0CC;line-height:1.5;')}>{v.profileNotes}</div>
          </div>
        )}
        <div style={sx('display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:10px 16px;')}>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>SERVICES</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;margin-top:3px;")}>{v.profileServices}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>SPENT</div>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;margin-top:3px;")}>{v.profileSpent}</div>
          </div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:14px;padding:12px;')}>
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>HEALTH</div>
            <div style={{ ...sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;margin-top:3px;"), color: v.profileHealthColor }}>{v.profileHealth}</div>
          </div>
        </div>
        {v.profileNotActive && (
          <div style={sx('margin:0 16px;')}>
            <button onClick={v.profileSetActive} className="hovC" style={sx("width:100%;background:#38BDF8;border:none;color:#08111A;border-radius:13px;padding:13px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:2px;cursor:pointer;")}>SET AS ACTIVE</button>
          </div>
        )}
      </div>
    );
  }

  renderEditBike(v) {
    const e = v.editForm;
    const inputStyle = sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:11px;color:#EDF1F6;padding:11px 13px;font-family:'Barlow',sans-serif;font-size:15px;outline:none;");
    const labelStyle = sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;color:#8A94A3;margin-bottom:5px;");
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(64px,calc(env(safe-area-inset-top) + 18px)) 16px 6px;')}>
          <button onClick={v.cancelEdit} style={sx('background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#EDF1F6;border-radius:10px;padding:7px 12px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px;')}>
            <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            Cancel
          </button>
        </div>
        <div style={sx('padding:8px 20px 14px;')}>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.5px;")}>Edit Details</div>
          <div style={sx('font-size:13px;color:#8A94A3;margin-top:2px;')}>Update your motorcycle's info. Maintenance history and schedule are kept.</div>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:10px;margin:0 16px;')}>
          <div>
            <div style={labelStyle}>NICKNAME *</div>
            <input name="name" value={e.name || ''} onChange={v.onEditInput} placeholder="e.g. Honda ADV160" className="inp" style={inputStyle} />
          </div>
          <div style={sx('display:grid;grid-template-columns:1fr 1fr;gap:10px;')}>
            <div>
              <div style={labelStyle}>BRAND</div>
              <input name="brand" value={e.brand || ''} onChange={v.onEditInput} placeholder="Honda" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>MODEL</div>
              <input name="model" value={e.model || ''} onChange={v.onEditInput} placeholder="ADV160" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>YEAR</div>
              <input name="year" value={e.year || ''} onChange={v.onEditInput} placeholder="2026" type="number" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>COLOR</div>
              <input name="color" value={e.color || ''} onChange={v.onEditInput} placeholder="Matte Black" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>PLATE NO.</div>
              <input name="plate" value={e.plate || ''} onChange={v.onEditInput} placeholder="ABC 1234" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>ODOMETER (KM)</div>
              <input name="odo" value={e.odo || ''} onChange={v.onEditInput} placeholder="0" type="number" className="inp" style={inputStyle} />
            </div>
          </div>
          <div>
            <div style={labelStyle}>NOTES</div>
            <textarea name="notes" value={e.notes || ''} onChange={v.onEditInput} rows="2" placeholder="Anything worth remembering…" className="inp" style={{ ...inputStyle, resize: 'none' }}></textarea>
          </div>
          <div style={sx('display:flex;gap:10px;margin-top:4px;')}>
            <button onClick={v.cancelEdit} style={sx("flex:1;background:none;border:1px solid rgba(255,255,255,0.14);color:#EDF1F6;border-radius:13px;padding:14px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:600;letter-spacing:2px;cursor:pointer;")}>CANCEL</button>
            <button onClick={v.saveEdit} className="hovC" style={sx("flex:2;background:#38BDF8;border:none;color:#08111A;border-radius:13px;padding:14px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:2px;cursor:pointer;")}>SAVE CHANGES</button>
          </div>
        </div>
      </div>
    );
  }

  renderAddBike(v) {
    const inputStyle = sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:11px;color:#EDF1F6;padding:11px 13px;font-family:'Barlow',sans-serif;font-size:15px;outline:none;");
    const labelStyle = sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;color:#8A94A3;margin-bottom:5px;");
    return (
      <div style={sx('animation:mcFade .32s cubic-bezier(.16,1,.3,1);')}>
        <div style={sx('padding:max(64px,calc(env(safe-area-inset-top) + 18px)) 16px 6px;')}>
          <button onClick={v.onboarding ? v.backToWelcome : v.goGarage} style={sx('background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#EDF1F6;border-radius:10px;padding:7px 12px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px;')}>
            <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            {v.onboarding ? 'Back' : 'Cancel'}
          </button>
        </div>
        <div style={sx('padding:8px 20px 14px;')}>
          {v.onboarding && (
            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2.5px;color:#38BDF8;margin-bottom:2px;")}>STEP 2 OF 2 · YOUR MOTORCYCLE</div>
          )}
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;letter-spacing:0.5px;")}>{v.onboarding ? 'Your Motorcycle' : 'Add Motorcycle'}</div>
          <div style={sx('font-size:13px;color:#8A94A3;margin-top:2px;')}>Already have kilometers on the bike? Tell us when each item was last serviced and your schedule picks up where you left off.</div>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:10px;margin:0 16px;')}>
          <div>
            <div style={labelStyle}>NICKNAME *</div>
            <input name="name" value={v.draft.name} onChange={v.onDraftInput} placeholder="e.g. Honda ADV160" className="inp" style={inputStyle} />
          </div>
          <div style={sx('display:grid;grid-template-columns:1fr 1fr;gap:10px;')}>
            <div>
              <div style={labelStyle}>BRAND</div>
              <input name="brand" value={v.draft.brand} onChange={v.onDraftInput} placeholder="Honda" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>MODEL</div>
              <input name="model" value={v.draft.model} onChange={v.onDraftInput} placeholder="ADV160" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>YEAR</div>
              <input name="year" value={v.draft.year} onChange={v.onDraftInput} placeholder="2026" type="number" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>COLOR</div>
              <input name="color" value={v.draft.color} onChange={v.onDraftInput} placeholder="Matte Black" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>PLATE NO.</div>
              <input name="plate" value={v.draft.plate} onChange={v.onDraftInput} placeholder="ABC 1234" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>ODOMETER (KM) *</div>
              <input name="odo" value={v.draft.odo} onChange={v.onDraftInput} placeholder="0" type="number" className="inp" style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>AVG RIDE (KM / MONTH)</div>
              <input name="kmPerMonth" value={v.draft.kmPerMonth} onChange={v.onDraftInput} placeholder="e.g. 500" type="number" className="inp" style={inputStyle} />
            </div>
          </div>
          <div style={sx('font-size:12px;color:#8A94A3;margin-top:-4px;line-height:1.45;')}>Average ride is used to estimate mileage when you only remember the <b>date</b> of a past service.</div>
          <div>
            <div style={labelStyle}>NOTES</div>
            <textarea name="notes" value={v.draft.notes} onChange={v.onDraftInput} rows="2" placeholder="Anything worth remembering…" className="inp" style={{ ...inputStyle, resize: 'none' }}></textarea>
          </div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:2.5px;color:#EDF1F6;margin-top:8px;")}>PREFERRED MAINTENANCE</div>
          <div style={sx('font-size:12px;color:#8A94A3;margin-top:-4px;line-height:1.45;')}>For each item, tell us when it was <b>last done</b> — by odometer (leave blank if just serviced, 0 if never), by date, or pick NOT SURE and we'll mark it as due for a check.</div>
          <div style={sx('background:var(--card);border:1px solid var(--card-line);box-shadow:var(--card-shadow);border-radius:16px;overflow:hidden;')}>
            {v.draftRows.map(d => (
              <div key={d.id} style={{ ...sx('padding:11px 14px;border-bottom:1px solid rgba(255,255,255,0.05);'), opacity: d.rowOpacity }}>
                <div style={sx('display:flex;align-items:center;gap:11px;')}>
                  <span style={sx('color:#8A94A3;flex-shrink:0;')}><ItemIcon id={d.id} size={17} /></span>
                  <span style={sx('flex:1;font-size:14px;font-weight:500;')}>{d.name}</span>
                  <button onClick={d.toggle} aria-label="Toggle item" style={{ ...sx('width:42px;height:25px;border-radius:13px;border:none;position:relative;cursor:pointer;flex-shrink:0;transition:background .15s;'), background: d.trackBg }}>
                    <div style={{ ...sx('position:absolute;top:3.5px;width:18px;height:18px;border-radius:9px;background:#fff;transition:left .15s;'), left: d.knobLeft }}></div>
                  </button>
                </div>
                {d.on && (
                  <div style={sx('margin-top:9px;margin-left:27px;')}>
                    <div style={sx('display:flex;align-items:center;gap:6px;')}>
                      <span style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;margin-right:2px;")}>LAST DONE</span>
                      {[['km', 'KM'], ['date', 'DATE'], ['unknown', 'NOT SURE']].map(([m, lbl]) => (
                        <button key={m} onClick={() => d.setMode(m)} style={d.mode === m
                          ? sx("background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.45);color:#38BDF8;border-radius:7px;padding:4px 9px;font-family:'Barlow Condensed',sans-serif;font-size:10.5px;font-weight:600;letter-spacing:1px;cursor:pointer;")
                          : sx("background:none;border:1px solid rgba(255,255,255,0.12);color:#8A94A3;border-radius:7px;padding:4px 9px;font-family:'Barlow Condensed',sans-serif;font-size:10.5px;font-weight:600;letter-spacing:1px;cursor:pointer;")}>{lbl}</button>
                      ))}
                    </div>
                    <div style={sx('display:flex;gap:10px;margin-top:8px;')}>
                      <div style={sx('flex:1;min-width:0;')}>
                        <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;margin-bottom:4px;")}>EVERY (KM)</div>
                        <input type="number" value={d.interval} onChange={d.onInterval} className="inp" style={sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:8px;color:#EDF1F6;padding:6px 9px;font-family:'Barlow',sans-serif;font-size:13px;outline:none;text-align:right;")} />
                      </div>
                      <div style={sx('flex:1;min-width:0;')}>
                        {d.mode === 'km' && (
                          <>
                            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;margin-bottom:4px;")}>LAST DONE AT (KM)</div>
                            <input type="number" value={d.lastKm} onChange={d.onLastKm} placeholder="just done" className="inp" style={sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:8px;color:#EDF1F6;padding:6px 9px;font-family:'Barlow',sans-serif;font-size:13px;outline:none;text-align:right;")} />
                          </>
                        )}
                        {d.mode === 'date' && (
                          <>
                            <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;margin-bottom:4px;")}>LAST DONE ON</div>
                            <input type="date" value={d.lastDate} onChange={d.onLastDate} className="inp" style={sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:8px;color:#EDF1F6;padding:5px 9px;font-family:'Barlow',sans-serif;font-size:13px;outline:none;")} />
                          </>
                        )}
                        {d.mode === 'unknown' && (
                          <div style={sx('font-size:11.5px;color:#FB923C;line-height:1.4;padding-top:14px;')}>Will be marked due now — log it once checked.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={v.saveBike} className="hovC" style={sx("width:100%;background:#38BDF8;border:none;color:#08111A;border-radius:13px;padding:14px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:2px;cursor:pointer;margin-top:4px;")}>SAVE TO GARAGE</button>
        </div>
      </div>
    );
  }

  renderRecordSheet(v) {
    const inputStyle = sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:11px;color:#EDF1F6;padding:10px 13px;font-family:'Barlow',sans-serif;font-size:15px;outline:none;");
    const labelStyle = sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;color:#8A94A3;margin-bottom:5px;");
    return (
      <>
        <div onClick={v.closeRec} style={sx('position:absolute;inset:0;z-index:60;background:rgba(0,0,0,0.55);animation:mcFade .2s ease;')}></div>
        <div style={sx('position:absolute;left:0;right:0;bottom:0;z-index:61;background:var(--sheet);border-top:1px solid rgba(255,255,255,0.1);border-radius:24px 24px 0 0;padding:10px 18px calc(42px + env(safe-area-inset-bottom));max-height:80%;overflow:auto;animation:mcSheet .42s cubic-bezier(.18,1.1,.28,1);box-shadow:0 -20px 50px -20px rgba(0,0,0,0.7);')}>
          <div style={sx('width:38px;height:4px;border-radius:2px;background:rgba(255,255,255,0.18);margin:0 auto 14px;')}></div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;letter-spacing:0.5px;margin-bottom:14px;")}>Log Maintenance</div>
          <div style={sx('display:flex;flex-direction:column;gap:10px;')}>
            <div>
              <div style={labelStyle}>MAINTENANCE TYPE</div>
              <select name="typeId" value={v.recForm.typeId} onChange={v.onRecInput} style={{ ...sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:11px;color:#EDF1F6;padding:11px 13px;font-family:'Barlow',sans-serif;font-size:15px;outline:none;"), appearance: 'none' }}>
                {v.typeOptions.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
            <div style={sx('display:grid;grid-template-columns:1fr 1fr;gap:10px;')}>
              <div>
                <div style={labelStyle}>DATE</div>
                <input name="date" type="date" value={v.recForm.date} onChange={v.onRecInput} className="inp" style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>ODOMETER (KM)</div>
                <input name="km" type="number" value={v.recForm.km} onChange={v.onRecInput} className="inp" style={inputStyle} />
              </div>
            </div>
            <div>
              <div style={labelStyle}>SHOP / MECHANIC</div>
              <select name="shopType" value={v.recForm.shopType} onChange={v.onRecInput} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="self">Self Service</option>
                <option value="casa">Casa (dealer service center)</option>
                <option value="shop">Shop</option>
                <option value="other">Other</option>
              </select>
            </div>
            {v.recForm.shopType !== 'self' && (
              <div>
                <div style={labelStyle}>{v.recForm.shopType === 'casa' ? 'CASA NAME' : v.recForm.shopType === 'shop' ? 'SHOP NAME' : 'WHERE?'}</div>
                <input name="shopName" value={v.recForm.shopName} onChange={v.onRecInput} placeholder={v.recForm.shopType === 'casa' ? 'e.g. Yamaha 3S Caloocan' : 'e.g. Kenny Moto Works'} className="inp" style={inputStyle} />
              </div>
            )}
            <div>
              <div style={labelStyle}>ITEMS &amp; PRICES ({v.currencySym})</div>
              <div style={sx('display:flex;flex-direction:column;gap:8px;')}>
                {v.recItems.map(it => (
                  <div key={it.idx} style={sx('display:flex;gap:8px;align-items:center;')}>
                    <input value={it.name} onChange={it.onName} placeholder="e.g. Shell Advance Long Ride" className="inp" style={{ ...inputStyle, width: 'auto', flex: 1, minWidth: 0 }} />
                    <input type="number" value={it.price} onChange={it.onPrice} placeholder="0" className="inp" style={{ ...inputStyle, width: '90px', flexShrink: 0, textAlign: 'right' }} />
                    {it.canRemove && (
                      <button onClick={it.onRemove} aria-label="Remove item" style={sx('background:none;border:1px solid rgba(255,255,255,0.14);color:#8A94A3;border-radius:9px;width:32px;height:32px;flex-shrink:0;cursor:pointer;font-size:14px;line-height:1;padding:0;')}>✕</button>
                    )}
                  </div>
                ))}
              </div>
              <div style={sx('display:flex;justify-content:space-between;align-items:center;margin-top:8px;')}>
                <button onClick={v.addRecItem} className="hovB" style={sx("background:none;border:1px dashed rgba(255,255,255,0.18);color:#8A94A3;border-radius:9px;padding:7px 12px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:1.5px;cursor:pointer;")}>+ ADD ITEM</button>
                <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;letter-spacing:1.5px;color:#8A94A3;")}>TOTAL <span style={sx('color:#38BDF8;font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;margin-left:4px;')}>{v.recTotalTxt}</span></div>
              </div>
            </div>
            <div>
              <div style={labelStyle}>NOTES</div>
              <textarea name="notes" value={v.recForm.notes} onChange={v.onRecInput} rows="2" placeholder="Optional" className="inp" style={{ ...inputStyle, resize: 'none' }}></textarea>
            </div>
            <button onClick={v.togglePhoto} className="hovD" style={{ ...sx("background:none;border:1.5px dashed rgba(255,255,255,0.18);border-radius:12px;padding:13px;font-size:13.5px;cursor:pointer;font-family:'Barlow',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;"), color: v.photoColor }}><Icon glyph="camera" size={17} />{v.photoLabel}</button>
            <div style={sx('background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:11px;padding:10px 13px;font-size:12.5px;color:#7DD3FC;')}>{v.recPreviewTxt}</div>
            <div style={sx('display:flex;gap:10px;margin-top:2px;')}>
              <button onClick={v.closeRec} style={sx("flex:1;background:none;border:1px solid rgba(255,255,255,0.14);color:#EDF1F6;border-radius:13px;padding:13px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:600;letter-spacing:2px;cursor:pointer;")}>CANCEL</button>
              <button onClick={v.saveRec} className="hovC" style={sx("flex:2;background:#38BDF8;border:none;color:#08111A;border-radius:13px;padding:13px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:2px;cursor:pointer;")}>SAVE SERVICE</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  renderOdoModal(v) {
    return (
      <>
        <div onClick={v.closeOdo} style={sx('position:absolute;inset:0;z-index:70;background:rgba(0,0,0,0.55);animation:mcFade .2s ease;')}></div>
        <div style={sx('position:absolute;left:24px;right:24px;top:36%;z-index:71;background:var(--sheet);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:20px;animation:mcSheet .34s cubic-bezier(.18,1.1,.28,1);')}>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:0.5px;")}>Update Odometer</div>
          <div style={sx('font-size:13px;color:#8A94A3;margin-top:2px;margin-bottom:12px;')}>Current: {v.odoFmt} km</div>
          <input type="number" value={v.odoVal} onChange={v.onOdoInput} autoFocus className="inp" style={sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:11px;color:#EDF1F6;padding:12px 13px;font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:700;outline:none;text-align:center;font-variant-numeric:tabular-nums;")} />
          <div style={sx('display:flex;gap:10px;margin-top:14px;')}>
            <button onClick={v.closeOdo} style={sx("flex:1;background:none;border:1px solid rgba(255,255,255,0.14);color:#EDF1F6;border-radius:12px;padding:12px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:600;letter-spacing:2px;cursor:pointer;")}>CANCEL</button>
            <button onClick={v.saveOdo} className="hovC" style={sx("flex:1;background:#38BDF8;border:none;color:#08111A;border-radius:12px;padding:12px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;cursor:pointer;")}>SAVE</button>
          </div>
        </div>
      </>
    );
  }

  renderTabBar(v) {
    const tabStyle = 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px 0;transition:color .2s ease;';
    const tabLabel = sx("font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;");
    const tabSty = (c) => ({ ...sx(tabStyle), color: c, filter: c === '#6B7684' ? 'none' : 'drop-shadow(0 0 7px rgba(56,189,248,0.55))' });
    return (
      <div style={sx('position:absolute;left:0;right:0;bottom:0;z-index:40;display:flex;padding:10px 8px max(32px,calc(env(safe-area-inset-bottom) + 14px));background:linear-gradient(180deg,rgba(10,14,20,0.78),rgba(8,11,16,0.94));backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid rgba(151,197,255,0.10);')}>
        <button onClick={v.goDash} style={tabSty(v.tabDashC)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5H14v-6h-4v6H5.5A1.5 1.5 0 0 1 4 19.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"></path></svg>
          <span style={tabLabel}>HOME</span>
        </button>
        <button onClick={v.goSchedule} style={tabSty(v.tabSchedC)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 17a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></path><line x1="12" y1="17" x2="16.5" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></line><circle cx="12" cy="17" r="1.6" fill="currentColor"></circle></svg>
          <span style={tabLabel}>SCHEDULE</span>
        </button>
        <button onClick={v.goHistory} style={tabSty(v.tabHistC)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"></circle><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          <span style={tabLabel}>HISTORY</span>
        </button>
        <button onClick={v.goExpenses} style={tabSty(v.tabExpC)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="13" width="3.5" height="7" rx="1" fill="currentColor"></rect><rect x="10.2" y="8" width="3.5" height="12" rx="1" fill="currentColor"></rect><rect x="16.5" y="4" width="3.5" height="16" rx="1" fill="currentColor"></rect></svg>
          <span style={tabLabel}>EXPENSES</span>
        </button>
        <button onClick={v.goGarage} style={tabSty(v.tabGarC)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20v-9l8-6 8 6v9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"></path><rect x="8" y="13" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"></rect></svg>
          <span style={tabLabel}>GARAGE</span>
        </button>
      </div>
    );
  }

  renderWelcome(v) {
    const inputStyle = sx("width:100%;box-sizing:border-box;background:var(--field);border:1px solid var(--field-line);border-radius:12px;color:#EDF1F6;padding:13px 15px;font-family:'Barlow',sans-serif;font-size:16px;outline:none;text-align:center;");
    return (
      <div style={sx('animation:mcFade .4s cubic-bezier(.16,1,.3,1);min-height:100%;display:flex;flex-direction:column;padding:max(72px,calc(env(safe-area-inset-top) + 40px)) 26px 40px;')}>
        <div style={sx('display:flex;flex-direction:column;align-items:center;text-align:center;')}>
          <div style={sx('position:relative;margin-bottom:22px;')}>
            <div style={{ position: 'absolute', inset: '-16px', borderRadius: '28px', background: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 65%)', filter: 'blur(8px)' }}></div>
            <div style={sx('position:relative;')}><LogoMark size={70} /></div>
          </div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:3px;color:#38BDF8;")}>KEN’S MOTOCARE</div>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:34px;font-weight:700;letter-spacing:0.5px;line-height:1.05;margin-top:8px;")}>Let’s set up your garage</div>
          <div style={sx('font-size:14px;color:#8A94A3;line-height:1.5;margin-top:10px;max-width:300px;')}>Track every service, watch your expenses, and never miss maintenance again. First, the basics.</div>
        </div>
        <div style={sx('margin-top:34px;')}>
          <div style={sx("font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;color:#8A94A3;margin-bottom:7px;text-align:center;")}>WHAT SHOULD WE CALL YOU?</div>
          <input name="userName" value={v.userName} onChange={v.onNameInput} placeholder="Your name" autoFocus className="inp" style={inputStyle} />
        </div>
        <div style={sx('flex:1;')}></div>
        <button onClick={v.startSetup} className="hovC" style={sx("width:100%;background:linear-gradient(160deg,#5FCBFA,#2FA8E0);border:none;color:#08131E;border-radius:14px;padding:15px;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;letter-spacing:2px;cursor:pointer;margin-top:28px;box-shadow:0 10px 28px -10px rgba(56,189,248,0.6);")}>GET STARTED</button>
        <button onClick={v.loadSample} style={sx('width:100%;background:none;border:none;color:#8A94A3;padding:14px;font-family:\'Barlow\',sans-serif;font-size:13.5px;cursor:pointer;margin-top:2px;')}>Just exploring? <span style={{ color: '#38BDF8', fontWeight: 600 }}>Load sample data</span></button>
      </div>
    );
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="phone">
        <div style={sx('flex:1;overflow:auto;padding-bottom:calc(130px + env(safe-area-inset-bottom));')}>
          {v.isWelcome && this.renderWelcome(v)}
          {v.isDash && this.renderDash(v)}
          {v.isSchedule && this.renderSchedule(v)}
          {v.isHistory && this.renderHistory(v)}
          {v.isExpenses && this.renderExpenses(v)}
          {v.isHealth && this.renderHealth(v)}
          {v.isGarage && this.renderGarage(v)}
          {v.isProfile && this.renderProfile(v)}
          {v.isEditBike && this.renderEditBike(v)}
          {v.isAddBike && this.renderAddBike(v)}
        </div>

        {!v.onboarding && this.renderTabBar(v)}

        {v.fabOn && (
          <button onClick={v.openRecBlank} aria-label="Log maintenance" className="fab hovC" style={sx('position:absolute;right:18px;bottom:calc(104px + env(safe-area-inset-bottom));z-index:41;width:54px;height:54px;border-radius:27px;background:linear-gradient(160deg,#5FCBFA,#2FA8E0);color:#08111A;border:none;font-size:30px;font-weight:400;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding-bottom:3px;')}>+</button>
        )}

        {v.recOpen && this.renderRecordSheet(v)}
        {v.odoOpen && this.renderOdoModal(v)}

        {v.hasToast && (
          <div style={sx('position:absolute;top:66px;left:20px;right:20px;z-index:90;background:rgba(18,26,36,0.92);border:1px solid rgba(74,222,128,0.4);border-radius:13px;padding:11px 15px;display:flex;align-items:center;gap:9px;animation:mcToast .38s cubic-bezier(.18,1.1,.28,1);backdrop-filter:blur(12px);box-shadow:0 12px 32px -10px rgba(0,0,0,0.6),0 0 20px -6px rgba(74,222,128,0.25);')}>
            <span style={sx('color:#4ADE80;flex-shrink:0;')}><Icon glyph="check" size={15} /></span>
            <span style={sx('font-size:13.5px;font-weight:500;')}>{v.toastMsg}</span>
          </div>
        )}
      </div>
    );
  }
}
