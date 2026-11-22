// Generates the profile SVGs (dark + light) into ../assets.
// Run: node scripts/build-assets.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

const FONT = `'Segoe UI Variable Display','Segoe UI',Inter,-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif`;
const MONO = `'JetBrains Mono','Cascadia Code',SFMono-Regular,Consolas,Menlo,monospace`;

const THEMES = {
  dark: {
    bg: "#0A0F1E", bg2: "#0E1630", surface: "#111A31", surface2: "#16213D",
    border: "#22304F", text: "#EAF0FA", muted: "#8E9CB8", faint: "#5A6886",
    a1: "#5FE3AE", a2: "#38BDF8", a3: "#818CF8", grid: "#1A2442",
    chip: "#0F2A2A", chipText: "#7FEFC0", brand: "#0B7A54", brandDeep: "#065038",
  },
  light: {
    bg: "#F6F9FC", bg2: "#EEF4FA", surface: "#FFFFFF", surface2: "#F3F7FB",
    border: "#DCE4EE", text: "#0B1324", muted: "#566580", faint: "#8D9AB0",
    a1: "#0B7A54", a2: "#0284C7", a3: "#4F46E5", grid: "#E3EAF3",
    chip: "#E7F6EF", chipText: "#0B6A49", brand: "#0B7A54", brandDeep: "#065038",
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const motionCss = `
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  .fade { opacity: 0; animation: fade .9s ease-out forwards; }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
`;

const ICONS = {
  bolt: `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>`,
  box: `<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>`,
  users: `<circle cx="9" cy="7" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><path d="M16 3.2a4 4 0 0 1 0 7.6"/><path d="M22 21v-1a6 6 0 0 0-4-5.6"/>`,
  bank: `<path d="M3 21h18"/><path d="M5 21V10M9 21V10M15 21V10M19 21V10"/><path d="M2 10 12 3l10 7z"/>`,
  layers: `<path d="M12 2 22 7 12 12 2 7z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>`,
  building: `<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h2a2 2 0 0 1 2 2v10"/><path d="M2 21h20"/><path d="M8 7h4M8 11h4M8 15h4"/>`,
};

const defs = (t, id) => `
  <linearGradient id="${id}-acc" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${t.a1}"/><stop offset=".55" stop-color="${t.a2}"/><stop offset="1" stop-color="${t.a3}"/>
  </linearGradient>
  <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${t.bg}"/><stop offset="1" stop-color="${t.bg2}"/>
  </linearGradient>
  <pattern id="${id}-grid" width="32" height="32" patternUnits="userSpaceOnUse">
    <path d="M32 0H0V32" fill="none" stroke="${t.grid}" stroke-width="1"/>
  </pattern>`;

// ---------- Header ----------
function header(t, mode) {
  const W = 1200, H = 380, id = "h";
  const pills = ["Utilities & Billing", "Inventory", "HR & Payroll", "Banking", "PropTech"];
  let x = 72;
  const pillSvg = pills.map((p, i) => {
    const w = p.length * 8.2 + 32;
    const s = `<g class="fade" style="animation-delay:${0.7 + i * 0.08}s"><rect x="${x}" y="268" width="${w}" height="32" rx="16" fill="${t.surface}" stroke="${t.border}"/><text x="${x + w / 2}" y="289" text-anchor="middle" font-size="14" font-weight="500" fill="${t.muted}">${esc(p)}</text></g>`;
    x += w + 10;
    return s;
  }).join("");

  // Logo mark: three stacked rounded bars forming an abstract "S"
  const logo = `
    <g transform="translate(72 64)">
      <rect width="64" height="64" rx="18" fill="${t.surface}" stroke="${t.border}"/>
      <rect x="14" y="15" width="36" height="9" rx="4.5" fill="url(#${id}-acc)"/>
      <rect x="14" y="27.5" width="22" height="9" rx="4.5" fill="${t.a2}" opacity=".85"/>
      <rect x="28" y="40" width="22" height="9" rx="4.5" fill="${t.a3}" opacity=".85"/>
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="Smart Innova — enterprise software studio">
<style>${motionCss}
  .orb { animation: drift 18s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
  .orb2 { animation-duration: 24s; animation-direction: alternate-reverse; }
  @keyframes drift { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-60px,30px) scale(1.15); } }
  .pulse { animation: pulse 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(1.8); } }
  .caret { animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .scan { animation: scan 6s linear infinite; }
  @keyframes scan { from { transform: translateX(-400px); } to { transform: translateX(1400px); } }
</style>
<defs>${defs(t, id)}
  <radialGradient id="${id}-o1"><stop offset="0" stop-color="${t.a1}" stop-opacity="${mode === "dark" ? .35 : .22}"/><stop offset="1" stop-color="${t.a1}" stop-opacity="0"/></radialGradient>
  <radialGradient id="${id}-o2"><stop offset="0" stop-color="${t.a3}" stop-opacity="${mode === "dark" ? .35 : .18}"/><stop offset="1" stop-color="${t.a3}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${id}-fadeR" x1="0" x2="1"><stop offset="0" stop-color="${t.bg}" stop-opacity="1"/><stop offset=".45" stop-color="${t.bg}" stop-opacity=".2"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></linearGradient>
  <linearGradient id="${id}-scan" x1="0" x2="1"><stop offset="0" stop-color="${t.a2}" stop-opacity="0"/><stop offset=".5" stop-color="${t.a2}" stop-opacity=".7"/><stop offset="1" stop-color="${t.a2}" stop-opacity="0"/></linearGradient>
  <clipPath id="${id}-clip"><rect width="${W}" height="${H}" rx="24"/></clipPath>
</defs>
<g clip-path="url(#${id}-clip)">
  <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-grid)" opacity=".7"/>
  <circle class="orb" cx="960" cy="90" r="300" fill="url(#${id}-o1)"/>
  <circle class="orb orb2" cx="1120" cy="330" r="260" fill="url(#${id}-o2)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-fadeR)"/>
  <rect class="scan" x="0" y="${H - 2}" width="400" height="2" fill="url(#${id}-scan)"/>

  <!-- code window (right) -->
  <g class="fade" style="animation-delay:.5s" transform="translate(770 70)">
    <rect width="360" height="236" rx="16" fill="${t.surface}" stroke="${t.border}" opacity=".96"/>
    <circle cx="22" cy="22" r="5" fill="#FF5F57"/><circle cx="40" cy="22" r="5" fill="#FEBC2E"/><circle cx="58" cy="22" r="5" fill="#28C840"/>
    <text x="340" y="27" text-anchor="end" font-family="${MONO}" font-size="12" fill="${t.faint}">company.yml</text>
    <line x1="0" y1="44" x2="360" y2="44" stroke="${t.border}"/>
    <g font-family="${MONO}" font-size="14">
      <text x="22" y="76"><tspan fill="${t.a3}">name</tspan><tspan fill="${t.muted}">: </tspan><tspan fill="${t.text}">Smart Innova</tspan></text>
      <text x="22" y="102"><tspan fill="${t.a3}">based</tspan><tspan fill="${t.muted}">: </tspan><tspan fill="${t.text}">Azerbaijan</tspan></text>
      <text x="22" y="128"><tspan fill="${t.a3}">builds</tspan><tspan fill="${t.muted}">: </tspan><tspan fill="${t.text}">[web, mobile, api]</tspan></text>
      <text x="22" y="154"><tspan fill="${t.a3}">stack</tspan><tspan fill="${t.muted}">: </tspan><tspan fill="${t.text}">[java, spring, flutter]</tspan></text>
      <text x="22" y="180"><tspan fill="${t.a3}">now</tspan><tspan fill="${t.muted}">: </tspan><tspan fill="${t.a1}">"Binam.az"</tspan></text>
      <text x="22" y="206"><tspan fill="${t.a3}">open_to</tspan><tspan fill="${t.muted}">: </tspan><tspan fill="${t.text}">partners</tspan><tspan class="caret" fill="${t.a2}">▍</tspan></text>
    </g>
  </g>

  <g class="fade" style="animation-delay:.05s">${logo}</g>
  <g class="fade" style="animation-delay:.15s">
    <text x="156" y="94" font-size="15" font-weight="600" letter-spacing="2.5" fill="${t.muted}">SOFTWARE STUDIO</text>
    <g transform="translate(156 112)"><circle class="pulse" cx="5" cy="0" r="4" fill="${t.a1}"/><circle cx="5" cy="0" r="4" fill="${t.a1}"/>
    <text x="18" y="5" font-size="14" fill="${t.muted}">Shipping <tspan fill="${t.text}" font-weight="600">Binam.az</tspan> — building management, reimagined</text></g>
  </g>
  <text class="fade" style="animation-delay:.25s" x="68" y="208" font-size="76" font-weight="700" letter-spacing="-2.5" fill="${t.text}">Smart <tspan fill="url(#${id}-acc)">Innova</tspan></text>
  <text class="fade" style="animation-delay:.4s" x="72" y="246" font-size="21" fill="${t.muted}">Enterprise software that runs real operations — from billing to banking.</text>
  ${pillSvg}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="none" stroke="${t.border}"/>
</svg>`;
}

// ---------- Section title ----------
function sectionTitle(t, eyebrow, title, id) {
  return `<text x="0" y="18" font-size="13" font-weight="700" letter-spacing="2.4" fill="url(#${id}-acc)">${esc(eyebrow)}</text>
  <text x="0" y="54" font-size="30" font-weight="700" letter-spacing="-.6" fill="${t.text}">${esc(title)}</text>`;
}

// ---------- Solutions grid ----------
function solutions(t) {
  const W = 1200, id = "s";
  const cards = [
    { icon: "bolt", title: "Utilities & Billing", lines: ["Subscriber billing, payments and", "debt tracking for utility providers."], tags: ["Java", "Oracle", "REST"] },
    { icon: "box", title: "Inventory & Warehouse", lines: ["Stock, warehouse and procurement —", "deployed across many organisations."], tags: ["JSF", "PrimeFaces"] },
    { icon: "users", title: "HR & Payroll", lines: ["Staff records, salary calculation", "and anonymous employee surveys."], tags: ["Jakarta EE", "EJB"] },
    { icon: "bank", title: "Banking & Integrations", lines: ["Internet-banking modules and", "secure inter-system web services."], tags: ["Java EE", "SOAP", "REST"] },
    { icon: "layers", title: "Enterprise Suite", lines: ["CRM, document flow, legal case", "management, travel and resorts."], tags: ["Java EE", "Oracle"] },
    { icon: "building", title: "Binam.az", lines: ["Mobile-first building management", "for residents and managers."], tags: ["Flutter", "Spring Boot"], featured: true },
  ];
  const cw = 388, ch = 196, gap = 18, top = 84;
  const H = top + ch * 2 + gap + 4;
  const body = cards.map((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = col * (cw + gap), y = top + row * (ch + gap);
    let tx = 28;
    const tags = c.tags.map((g) => {
      const w = g.length * 7.4 + 22;
      const s = `<rect x="${tx}" y="150" width="${w}" height="26" rx="8" fill="${t.surface2}" stroke="${t.border}"/><text x="${tx + w / 2}" y="167.5" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${t.muted}">${esc(g)}</text>`;
      tx += w + 8;
      return s;
    }).join("");
    const stroke = c.featured ? `url(#${id}-acc)` : t.border;
    return `<g class="fade" style="animation-delay:${0.08 * i}s" transform="translate(${x} ${y})">
      <rect x=".5" y=".5" width="${cw - 1}" height="${ch - 1}" rx="18" fill="${t.surface}" stroke="${stroke}" stroke-width="${c.featured ? 1.6 : 1}"/>
      ${c.featured ? `<rect x="${cw - 104}" y="24" width="78" height="24" rx="12" fill="${t.chip}"/><text x="${cw - 65}" y="40.5" text-anchor="middle" font-size="12" font-weight="700" fill="${t.chipText}">NEW</text>` : ""}
      <rect x="28" y="24" width="44" height="44" rx="12" fill="${t.surface2}" stroke="${t.border}"/>
      <g transform="translate(38 34)" fill="none" stroke="url(#${id}-acc)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g transform="scale(1)">${ICONS[c.icon]}</g></g>
      <text x="28" y="98" font-size="20" font-weight="650" fill="${t.text}">${esc(c.title)}</text>
      <text x="28" y="122" font-size="14.5" fill="${t.muted}">${esc(c.lines[0])}</text>
      <text x="28" y="141" font-size="14.5" fill="${t.muted}" dy="0">${esc(c.lines[1])}</text>
      <g transform="translate(0 2)">${tags}</g>
    </g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="What we build">
<style>${motionCss}</style><defs>${defs(t, id)}</defs>
${sectionTitle(t, "WHAT WE BUILD", "Software behind everyday operations", id)}
${body}
</svg>`;
}

// ---------- Featured: Binam.az ----------
function featured(t, mode) {
  const W = 1200, H = 400, id = "f";
  const g1 = mode === "dark" ? "#06261C" : "#0B7A54";
  const g2 = mode === "dark" ? "#0B3B2C" : "#065038";
  const feats = [
    ["Payments & debts", "Residents see and pay utility bills in seconds"],
    ["Requests & repairs", "Report an issue with a photo, track it to done"],
    ["Announcements & polls", "Managers reach every flat instantly"],
  ];
  const featSvg = feats.map(([a, b], i) => `
    <g class="fade" style="animation-delay:${0.3 + i * 0.12}s" transform="translate(64 ${178 + i * 56})">
      <rect width="34" height="34" rx="10" fill="#FFFFFF" fill-opacity=".1" stroke="#5FE3AE" stroke-opacity=".5"/>
      <path d="M10 17.5 15 22l9-10" fill="none" stroke="#5FE3AE" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="50" y="14" font-size="16.5" font-weight="650" fill="#FFFFFF">${esc(a)}</text>
      <text x="50" y="33" font-size="14" fill="#BFEBD9">${esc(b)}</text>
    </g>`).join("");

  // phone mock
  const phone = `
  <g class="float" transform="translate(800 30)">
    <rect width="220" height="440" rx="36" fill="#0A1712" stroke="#2C5A49" stroke-width="2"/>
    <rect x="10" y="10" width="200" height="420" rx="28" fill="#F4FAF7"/>
    <rect x="80" y="20" width="60" height="16" rx="8" fill="#0A1712"/>
    <text x="26" y="66" font-size="11" fill="#5B6B65">Salam, Aysel</text>
    <text x="26" y="86" font-size="16" font-weight="700" fill="#0B1F18">Mənzil 42</text>
    <rect x="22" y="100" width="176" height="88" rx="16" fill="#0B7A54"/>
    <text x="36" y="124" font-size="11" fill="#BFEBD9">Ümumi borc</text>
    <text x="36" y="152" font-size="24" font-weight="700" fill="#FFFFFF">0.00 ₼</text>
    <rect x="36" y="162" width="70" height="16" rx="8" fill="#5FE3AE"/><text x="71" y="174" text-anchor="middle" font-size="9.5" font-weight="700" fill="#065038">ÖDƏNİLDİ</text>
    ${[["Su", "12.40"], ["Qaz", "18.75"], ["Servis", "25.00"]].map(([n, v], i) => `
    <rect x="22" y="${200 + i * 46}" width="176" height="38" rx="12" fill="#FFFFFF" stroke="#E1EDE7"/>
    <circle cx="42" cy="${219 + i * 46}" r="9" fill="#E7F6EF"/>
    <text x="58" y="${223 + i * 46}" font-size="12" font-weight="600" fill="#0B1F18">${n}</text>
    <text x="186" y="${223 + i * 46}" text-anchor="end" font-size="12" fill="#5B6B65">${v} ₼</text>`).join("")}
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="Featured product: Binam.az">
<style>${motionCss}
  .float { animation: float 6s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translate(800px,30px); } 50% { transform: translate(800px,18px); } }
  .ring { animation: spin 40s linear infinite; transform-origin: 910px 200px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
<defs>
  <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g2}"/><stop offset="1" stop-color="${g1}"/></linearGradient>
  <radialGradient id="${id}-glow" cx=".75" cy=".4" r=".55"><stop offset="0" stop-color="#5FE3AE" stop-opacity=".35"/><stop offset="1" stop-color="#5FE3AE" stop-opacity="0"/></radialGradient>
  <pattern id="${id}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#FFFFFF" fill-opacity=".08"/></pattern>
  <clipPath id="${id}-clip"><rect width="${W}" height="${H}" rx="24"/></clipPath>
</defs>
<g clip-path="url(#${id}-clip)">
  <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-dots)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-glow)"/>
  <g class="ring" fill="none" stroke="#5FE3AE" stroke-opacity=".18">
    <circle cx="910" cy="200" r="210" stroke-dasharray="4 10"/>
    <circle cx="910" cy="200" r="290" stroke-dasharray="2 14"/>
  </g>
  <g class="fade">
    <rect x="64" y="52" width="150" height="28" rx="14" fill="#FFFFFF" fill-opacity=".1" stroke="#5FE3AE" stroke-opacity=".45"/>
    <circle cx="82" cy="66" r="4" fill="#5FE3AE"/>
    <text x="94" y="71" font-size="12.5" font-weight="700" letter-spacing="1.6" fill="#5FE3AE">IN PROGRESS</text>
    <text x="62" y="134" font-size="52" font-weight="750" letter-spacing="-1.6" fill="#FFFFFF">Binam<tspan fill="#5FE3AE">.az</tspan></text>
    <text x="330" y="134" font-size="20" fill="#BFEBD9">Bina idarəetmə tətbiqi</text>
  </g>
  ${featSvg}
  <g class="fade" style="animation-delay:.7s" transform="translate(1060 64)" font-family="${MONO}" font-size="12.5" fill="#BFEBD9">
    <text y="0">iOS · Android</text><text y="22">Flutter</text><text y="44">Spring Boot</text><text y="66">Oracle</text>
  </g>
  ${phone}
</g>
</svg>`;
}

// ---------- Stack ----------
function stack(t) {
  const W = 1200, id = "k";
  const groups = [
    { name: "Backend", items: ["Java 17", "Spring Boot", "Jakarta EE", "EJB", "REST", "SOAP"] },
    { name: "Frontend", items: ["JSF", "PrimeFaces", "JavaScript", "HTML5", "CSS3"] },
    { name: "Mobile", items: ["Flutter", "Dart", "iOS", "Android"] },
    { name: "Data & Ops", items: ["Oracle DB", "Docker", "GlassFish", "Tomcat", "Maven", "Git"] },
  ];
  const top = 84, rowH = 64;
  const H = top + groups.length * rowH + 8;
  const rows = groups.map((g, r) => {
    const y = top + r * rowH;
    let x = 190;
    const items = g.items.map((it) => {
      const w = it.length * 8.6 + 34;
      const s = `<rect x="${x}" y="10" width="${w}" height="36" rx="10" fill="${t.surface}" stroke="${t.border}"/><circle cx="${x + 16}" cy="28" r="3.5" fill="url(#${id}-acc)"/><text x="${x + 27}" y="33" font-size="14.5" font-weight="550" fill="${t.text}">${esc(it)}</text>`;
      x += w + 10;
      return s;
    }).join("");
    return `<g class="fade" style="animation-delay:${r * 0.1}s" transform="translate(0 ${y})">
      <text x="0" y="33" font-family="${MONO}" font-size="13.5" fill="${t.faint}">${String(r + 1).padStart(2, "0")}</text>
      <text x="36" y="33" font-size="16" font-weight="650" fill="${t.muted}">${esc(g.name)}</text>
      <line x1="190" y1="${rowH - 4}" x2="${W}" y2="${rowH - 4}" stroke="${t.border}" stroke-dasharray="3 6" opacity="${r === groups.length - 1 ? 0 : 1}"/>
      ${items}
    </g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="Tech stack">
<style>${motionCss}</style><defs>${defs(t, id)}</defs>
${sectionTitle(t, "TECH STACK", "Proven tools, chosen for longevity", id)}
${rows}
</svg>`;
}

// ---------- Principles ----------
function principles(t) {
  const W = 1200, id = "p", H = 250;
  const items = [
    ["01", "Built for production", "Systems that handle real money,", "real records and real people."],
    ["02", "Local by design", "Azerbaijani language, local payment", "rails and regulations from day one."],
    ["03", "Long-term partner", "We ship, support and evolve —", "not hand over and disappear."],
  ];
  const cw = 388, gap = 18;
  const cards = items.map(([n, a, b, c], i) => `
    <g class="fade" style="animation-delay:${i * 0.1}s" transform="translate(${i * (cw + gap)} 84)">
      <rect x=".5" y=".5" width="${cw - 1}" height="160" rx="18" fill="${t.surface}" stroke="${t.border}"/>
      <text x="28" y="56" font-size="40" font-weight="750" letter-spacing="-1" fill="url(#${id}-acc)">${n}</text>
      <text x="28" y="94" font-size="19" font-weight="650" fill="${t.text}">${esc(a)}</text>
      <text x="28" y="118" font-size="14.5" fill="${t.muted}">${esc(b)}</text>
      <text x="28" y="137" font-size="14.5" fill="${t.muted}">${esc(c)}</text>
    </g>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="How we work">
<style>${motionCss}</style><defs>${defs(t, id)}</defs>
${sectionTitle(t, "HOW WE WORK", "Engineering that earns trust", id)}
${cards}
</svg>`;
}

// ---------- Footer ----------
function footer(t) {
  const W = 1200, H = 120, id = "z";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="Smart Innova">
<style>
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  .wave { animation: wave 10s linear infinite; }
  @keyframes wave { to { transform: translateX(-600px); } }
</style>
<defs>${defs(t, id)}<clipPath id="${id}-c"><rect width="${W}" height="${H}"/></clipPath></defs>
<g clip-path="url(#${id}-c)">
  <g class="wave" fill="none" stroke="url(#${id}-acc)" stroke-width="2" opacity=".6">
    <path d="${Array.from({ length: 6 }, (_, i) => `M${i * 600} 36 q150 -26 300 0 t300 0`).join(" ")}"/>
  </g>
</g>
<text x="${W / 2}" y="86" text-anchor="middle" font-size="15" fill="${t.muted}">Smart Innova · Enterprise software from Azerbaijan</text>
</svg>`;
}

const builders = { header, solutions, featured, stack, principles, footer };
for (const [mode, t] of Object.entries(THEMES)) {
  for (const [name, fn] of Object.entries(builders)) {
    writeFileSync(join(OUT, `${name}-${mode}.svg`), fn(t, mode).replace(/\n\s*\n/g, "\n"));
  }
}
console.log("assets written to", OUT);
