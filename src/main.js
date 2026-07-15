import { bloodTypes, createLabels, formatDate, productTypes, toCsv, unitVolumes } from "./labelUtils.js";

const form = document.querySelector("#labelForm");
const labelSheet = document.querySelector("#labelSheet");
const labelCount = document.querySelector("#labelCount");
const productSelect = document.querySelector("#productType");
const bloodSelect = document.querySelector("#bloodType");
const unitVolumeSelect = document.querySelector("#unitVolume");
let currentLabels = [];

productSelect.innerHTML = productTypes.map((product) => `<option>${product}</option>`).join("");
bloodSelect.innerHTML = bloodTypes.map((type) => `<option>${type}</option>`).join("");
unitVolumeSelect.innerHTML = unitVolumes.map((volume) => `<option>${volume}</option>`).join("");
bloodSelect.value = "A POS";
productSelect.value = "Whole Blood";
unitVolumeSelect.value = "450 mL";
form.elements.collectionDate.value = formatDate(new Date());

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function getConfig() {
  return Object.fromEntries(new FormData(form).entries());
}

function render() {
  currentLabels = createLabels(getConfig());
  labelCount.textContent = currentLabels.length;
  labelSheet.innerHTML = currentLabels.map((label) => `
    <article class="blood-label">
      <div class="training-banner">TRAINING ONLY — NOT FOR TRANSFUSION</div>
      <div class="label-header"><div><span>Unit number</span><strong>${escapeHtml(label.unitNumber)}</strong></div><div class="blood-type">${escapeHtml(label.bloodType)}</div></div>
      <dl>
        <div><dt>Product</dt><dd>${escapeHtml(label.productType)}</dd></div>
        <div><dt>Collection Date</dt><dd>${escapeHtml(label.collectionDisplayDate)}</dd></div>
        <div><dt>Unit Volume</dt><dd>${escapeHtml(label.unitVolume)}</dd></div>
        <div><dt>Expires</dt><dd>${escapeHtml(label.expirationDate)}</dd></div>
        <div><dt>Donor ID</dt><dd>${escapeHtml(label.donorId)}</dd></div>
        <div><dt>Storage</dt><dd>${escapeHtml(label.storageRequirement)}</dd></div>
        <div><dt>Scenario</dt><dd>${escapeHtml(label.trainingScenario)}</dd></div>
      </dl>
      <p>${escapeHtml(label.remarks)}</p>
    </article>`).join("");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});
form.addEventListener("input", (event) => {
  if (event.target.name === "donorPrefix") event.target.value = event.target.value.toUpperCase();
});
document.querySelector("#printButton").addEventListener("click", () => window.print());
document.querySelector("#csvButton").addEventListener("click", () => download("tbld-m-training-labels.csv", toCsv(currentLabels), "text/csv;charset=utf-8"));
render();
