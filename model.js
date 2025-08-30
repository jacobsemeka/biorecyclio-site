
const FEEDSTOCKS = {
  "Kitchen waste": { TS: 0.30, VS: 0.85, Y: 0.45 },
  "Food waste (mixed)": { TS: 0.30, VS: 0.90, Y: 0.55 },
  "Cow manure": { TS: 0.12, VS: 0.80, Y: 0.22 },
  "Poultry manure": { TS: 0.25, VS: 0.80, Y: 0.35 },
  "Maize silage": { TS: 0.33, VS: 0.95, Y: 0.22 },
  "Grass clippings": { TS: 0.20, VS: 0.85, Y: 0.25 }
};

function rowTemplate(i) {
  return `
  <div class="grid grid-cols-12 gap-2 items-center row" data-index="${i}">
    <div class="col-span-6">
      <select class="feed w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900">
        ${Object.keys(FEEDSTOCKS).map(k=>`<option>${k}</option>`).join("")}
      </select>
    </div>
    <div class="col-span-6">
      <div class="flex items-center gap-2">
        <input type="number" class="mass w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900" value="10" min="0" step="0.1" />
        <span class="text-xs text-slate-300">kg/day</span>
      </div>
    </div>
    <div class="col-span-12 text-xs text-slate-300">
      <span class="badge"></span>
    </div>
  </div>`;
}

function fmt(n) { return Number(n).toLocaleString(undefined,{maximumFractionDigits:3}); }

function blendedYield(rows) {
  let VSsum=0, Gassum=0;
  rows.forEach(r=>{
    const feed = r.querySelector(".feed").value;
    const mass = parseFloat(r.querySelector(".mass").value||0);
    const p = FEEDSTOCKS[feed];
    const VS = mass * p.TS * p.VS;
    VSsum += VS;
    Gassum += VS * p.Y;
  });
  return VSsum>0 ? Gassum/VSsum : 0;
}

function recalc() {
  const rows = [...document.querySelectorAll(".row")];
  let VSkg=0, masskg=0;
  rows.forEach(r=>{
    const feed = r.querySelector(".feed").value;
    const mass = parseFloat(r.querySelector(".mass").value||0);
    const p = FEEDSTOCKS[feed];
    const TS = p.TS, VS = p.VS;
    const VS_row = mass * TS * VS;
    VSkg += VS_row;
    masskg += mass;
    r.querySelector(".badge").textContent = `TS ${(TS*100).toFixed(0)}%, VS ${(VS*100).toFixed(0)}%, yield ${p.Y} m³/kg VS`;
  });

  const CH4frac = parseFloat(document.getElementById("ch4").value);
  const HRT = parseFloat(document.getElementById("hrt").value);
  const kwhPerM3 = parseFloat(document.getElementById("kwhm3").value);
  const storageFrac = parseFloat(document.getElementById("storage").value);

  const biogas_m3_day = VSkg * blendedYield(rows);
  const ch4_m3_day = biogas_m3_day * CH4frac;
  const energy_kwh_day = biogas_m3_day * kwhPerM3;

  const dailyVol_m3 = masskg / 1000.0;
  const Vdig_m3 = dailyVol_m3 * HRT;
  const OLR = VSkg / Math.max(Vdig_m3, 1e-6);
  const storage_m3 = storageFrac * biogas_m3_day;

  document.getElementById("sumMass").textContent = fmt(masskg);
  document.getElementById("sumVS").textContent = fmt(VSkg);
  document.getElementById("sumBiogas").textContent = fmt(biogas_m3_day);
  document.getElementById("sumCH4").textContent = fmt(ch4_m3_day);
  document.getElementById("sumEnergy").textContent = fmt(energy_kwh_day);
  document.getElementById("digesterVol").textContent = fmt(Vdig_m3);
  document.getElementById("olr").textContent = fmt(OLR);
  document.getElementById("storageOut").textContent = fmt(storage_m3);

  const warn = document.getElementById("warn");
  warn.innerHTML = "";
  if (OLR > 4) warn.innerHTML += `<li>OLR ${fmt(OLR)} kg VS/m³·day is high for wet digesters (typical 1–4). Consider higher HRT or less VS.</li>`;
  if (OLR < 0.5) warn.innerHTML += `<li>OLR ${fmt(OLR)} is low; process may be under-loaded.</li>`;
  if (HRT < 20) warn.innerHTML += `<li>HRT ${HRT} d is short for mesophilic digestion; many substrates need 20–40 days.</li>`;
}

function addRow() {
  const container = document.getElementById("rows");
  const i = container.children.length;
  container.insertAdjacentHTML("beforeend", rowTemplate(i));
  bind();
  recalc();
}

function bind() {
  document.querySelectorAll(".feed, .mass").forEach(el=>{ el.oninput = recalc; el.onchange = recalc; });
  ["ch4","hrt","kwhm3","storage"].forEach(id=>{
    document.getElementById(id).oninput = recalc;
    document.getElementById(id).onchange = recalc;
  });
}

window.addEventListener("DOMContentLoaded", ()=>{ addRow(); addRow(); });
