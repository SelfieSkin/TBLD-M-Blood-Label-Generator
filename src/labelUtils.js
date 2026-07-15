export const bloodTypes = ["A POS", "A NEG", "B POS", "B NEG", "AB POS", "AB NEG", "O POS", "O NEG"];
export const productTypes = [
  "Whole Blood",
  "Packed Red Blood Cells",
  "Low Titer O Whole Blood",
  "Fresh Frozen Plasma",
  "Platelets"
];
export const unitVolumes = ["250 mL", "350 mL", "450 mL", "500 mL"];

const pad = (value, length = 2) => String(value).padStart(length, "0");

export function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDisplayDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}

export function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + Number(days));
  return formatDate(date);
}

export function makeDonorId(index, seed = "TBLDM") {
  return `${seed}-${pad(index + 1, 4)}`;
}

export function makeUnitNumber(collectionDate, index) {
  const date = new Date(`${collectionDate}T00:00:00`);
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  return `TRN-${stamp}-${pad(index + 1, 3)}`;
}

export function createLabels(config) {
  const quantity = Math.max(1, Math.min(60, Number(config.quantity) || 1));
  const collectionDate = config.collectionDate || formatDate(new Date());
  return Array.from({ length: quantity }, (_, index) => ({
    id: index + 1,
    unitNumber: makeUnitNumber(collectionDate, index),
    donorId: makeDonorId(index, config.donorPrefix || "TBLDM"),
    productType: config.productType,
    bloodType: config.bloodType,
    collectionDate,
    collectionDisplayDate: formatDisplayDate(collectionDate),
    expirationDate: addDays(collectionDate, config.shelfLifeDays || 21),
    unitVolume: config.unitVolume,
    trainingScenario: config.trainingScenario,
    storageRequirement: config.storageRequirement,
    remarks: config.remarks,
    trainingOnly: true
  }));
}

export function toCsv(labels) {
  const headers = [
    "Unit Number",
    "Donor ID",
    "Product",
    "ABO/RH Type",
    "Collection Date",
    "Expiration Date",
    "Unit Volume",
    "Storage",
    "Scenario",
    "Remarks",
    "Training Only"
  ];
  const rows = labels.map((label) => [
    label.unitNumber,
    label.donorId,
    label.productType,
    label.bloodType,
    label.collectionDate,
    label.expirationDate,
    label.unitVolume,
    label.storageRequirement,
    label.trainingScenario,
    label.remarks,
    label.trainingOnly ? "YES" : "NO"
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
}
