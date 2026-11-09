import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MinfinBankService } from "../src/services/rates/minfin.service";

const cashTable = `
  <table>
    <tr><th>Валюта</th><th>Покупка</th><th>Продажа</th><th>Обновление</th></tr>
    <tr><td>USD</td><td>45.4000</td><td>0</td><td>46.0000</td><td>0</td><td>08.11.2026</td></tr>
    <tr><td>EUR</td><td>51.0000</td><td>0</td><td>51.7000</td><td>0</td><td>08.11.2026</td></tr>
    <tr><td>PLN</td><td>11.4500</td><td>0</td><td>11.7500</td><td>0</td><td>08.11.2026</td></tr>
  </table>
  <table>
    <tr><td>USD</td><td>45.5000</td><td>0</td><td>46.0000</td><td>0</td><td>08.11.2026</td></tr>
  </table>
`;

describe("Minfin bank page parser", () => {
  it("reads the cash rate table and keeps the first row per currency", () => {
    const rates = MinfinBankService.parse(cashTable);

    assert.deepEqual(
      rates.map((rate) => rate.currency),
      ["USD", "EUR", "PLN"],
    );
    assert.equal(rates[0].buy, 45.4);
    assert.equal(rates[0].sell, 46);
  });

  it("drops rows with implausible values", () => {
    const html = `
      <table>
        <tr><td>USD</td><td>0.4000</td><td>0</td><td>0.5000</td><td>0</td><td>08.11.2026</td></tr>
        <tr><td>EUR</td><td>50.5500</td><td>0</td><td>51.5000</td><td>0</td><td>08.11.2026</td></tr>
      </table>
    `;

    const rates = MinfinBankService.parse(html);

    assert.deepEqual(rates.map((rate) => rate.currency), ["EUR"]);
  });

  it("ignores markup and returns an empty list when no rows match", () => {
    assert.deepEqual(MinfinBankService.parse("<div>No rates here</div>"), []);
  });
});
