import test from "node:test";
import assert from "node:assert/strict";
import { createLabels, toCsv } from "../src/labelUtils.js";

const config = {
  quantity: 2,
  donorPrefix: "TEST",
  productType: "Whole Blood",
  bloodType: "A POS",
  collectionDate: "2026-07-15",
  unitVolume: "450 mL",
  shelfLifeDays: 21,
  storageRequirement: "Store 1-6°C",
  trainingScenario: "Validation lane",
  remarks: "Training only"
};

test("creates sequential training labels with blood unit fields and expiration dates", () => {
  const labels = createLabels(config);
  assert.equal(labels.length, 2);
  assert.equal(labels[0].unitNumber, "TRN-20260715-001");
  assert.equal(labels[1].donorId, "TEST-0002");
  assert.equal(labels[0].bloodType, "A POS");
  assert.equal(labels[0].productType, "Whole Blood");
  assert.equal(labels[0].collectionDisplayDate, "07/15/2026");
  assert.equal(labels[0].unitVolume, "450 mL");
  assert.equal(labels[0].expirationDate, "2026-08-05");
  assert.equal(labels[0].trainingOnly, true);
});

test("exports labels as quoted csv with blood unit fields", () => {
  const csv = toCsv(createLabels({ ...config, quantity: 1, remarks: "Training, not clinical" }));
  assert.match(csv, /"Unit Number","Donor ID","Product","ABO\/RH Type"/);
  assert.match(csv, /"450 mL"/);
  assert.match(csv, /"Training, not clinical"/);
  assert.match(csv, /"YES"/);
});
