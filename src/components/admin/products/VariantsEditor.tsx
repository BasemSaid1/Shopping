"use client";

import { useState } from "react";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import {
  MAX_OPTIONS,
  MAX_VALUES,
  buildRows,
  countCombos,
  type OptionDraft,
  type VariantRow,
} from "@/lib/variantDraft";

const SUGGESTIONS = ["المقاس", "اللون", "السعة", "الذاكرة"];

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function ValuesInput({
  values,
  onAdd,
  onRemove,
}: {
  values: string[];
  onAdd: (values: string[]) => void;
  onRemove: (value: string) => void;
}) {
  const [text, setText] = useState("");

  function commit() {
    // بيقبل أكتر من قيمة مفصولة بفاصلة: S, M, L
    const parts = text
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (parts.length > 0) onAdd(parts);
    setText("");
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"
          >
            {v}
            <button
              type="button"
              onClick={() => onRemove(v)}
              aria-label={`حذف ${v}`}
              className="text-xs text-blue-400 hover:text-red-500"
            >
              <FaTimes />
            </button>
          </span>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        maxLength={200}
        placeholder="اكتب قيمة واضغط Enter (مثال: S, M, L)"
        autoComplete="off"
        className={inputClass}
      />
    </div>
  );
}

export default function VariantsEditor({
  options,
  rows,
  error,
  onChange,
}: {
  options: OptionDraft[];
  rows: VariantRow[];
  error?: string;
  onChange: (options: OptionDraft[], rows: VariantRow[]) => void;
}) {
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  const active = options.filter((o) => o.values.length > 0);
  const tooMany = countCombos(options) > 100;

  function setOptions(next: OptionDraft[]) {
    onChange(next, buildRows(next, rows));
  }

  function updateOption(index: number, patch: Partial<OptionDraft>) {
    setOptions(options.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  }

  // بنضيف كل القيم في تحديث واحد (S, M, L) ونتجاهل المكرر
  function addValues(index: number, raw: string[]) {
    const option = options[index];
    const next = [...option.values];
    for (const item of raw) {
      const value = item.trim().slice(0, 50);
      if (
        value &&
        next.length < MAX_VALUES &&
        !next.some((v) => v.toLowerCase() === value.toLowerCase())
      ) {
        next.push(value);
      }
    }
    if (next.length !== option.values.length) {
      updateOption(index, { values: next });
    }
  }

  function patchRow(key: string, patch: Partial<VariantRow>) {
    onChange(
      options,
      rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
  }

  function applyBulk() {
    onChange(
      options,
      rows.map((r) => ({
        ...r,
        price: bulkPrice.trim() ? bulkPrice : r.price,
        stock: bulkStock.trim() ? bulkStock : r.stock,
      })),
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        عرّف الخيارات وقيمها الأول (مثلًا المقاس: S, M, L)، وبعدها حدّد سعر
        ومخزون كل تركيبة.
      </p>

      {options.map((option, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-gray-200 bg-white p-3"
        >
          <div className="flex items-center gap-2">
            <input
              value={option.name}
              onChange={(e) => updateOption(index, { name: e.target.value })}
              maxLength={30}
              placeholder="اسم الخيار (مثال: المقاس)"
              autoComplete="off"
              aria-label="اسم الخيار"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setOptions(options.filter((_, i) => i !== index))}
              aria-label="حذف الخيار"
              className="rounded-lg p-2.5 text-red-600 ring-1 ring-red-200 hover:bg-red-50"
            >
              <FaTrash />
            </button>
          </div>

          {!option.name.trim() && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.filter(
                (s) => !options.some((o) => o.name.trim() === s),
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateOption(index, { name: s })}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <ValuesInput
            values={option.values}
            onAdd={(v) => addValues(index, v)}
            onRemove={(v) =>
              updateOption(index, {
                values: option.values.filter((x) => x !== v),
              })
            }
          />
        </div>
      ))}

      {options.length < MAX_OPTIONS && (
        <button
          type="button"
          onClick={() => setOptions([...options, { name: "", values: [] }])}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <FaPlus className="text-xs" /> إضافة خيار
        </button>
      )}

      {tooMany && (
        <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
          عدد التركيبات أكبر من 100. قلّل القيم عشان الجدول يظهر.
        </p>
      )}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-2 rounded-xl bg-white p-3">
            <div className="min-w-24 flex-1">
              <label
                htmlFor="bulk-price"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                سعر لكل التركيبات
              </label>
              <input
                id="bulk-price"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
              />
            </div>
            <div className="min-w-24 flex-1">
              <label
                htmlFor="bulk-stock"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                مخزون لكل التركيبات
              </label>
              <input
                id="bulk-stock"
                value={bulkStock}
                onChange={(e) => setBulkStock(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={applyBulk}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
            >
              تطبيق
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="w-10 p-2" aria-label="تفعيل" />
                  <th className="p-2 text-start">
                    {active.map((o) => o.name.trim() || "؟").join(" / ")}
                  </th>
                  <th className="w-28 p-2 text-start">السعر</th>
                  <th className="w-24 p-2 text-start">المخزون</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.key}
                    className={`border-t border-gray-100 ${
                      row.enabled ? "" : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.enabled}
                        onChange={(e) =>
                          patchRow(row.key, { enabled: e.target.checked })
                        }
                        aria-label={`تفعيل ${row.values.join(" / ")}`}
                        className="h-4 w-4 accent-blue-600"
                      />
                    </td>
                    <td className="p-2 font-semibold">
                      {row.values.join(" / ")}
                    </td>
                    <td className="p-2">
                      <input
                        value={row.price}
                        onChange={(e) =>
                          patchRow(row.key, { price: e.target.value })
                        }
                        disabled={!row.enabled}
                        inputMode="decimal"
                        autoComplete="off"
                        aria-label={`سعر ${row.values.join(" / ")}`}
                        className={`${inputClass} disabled:bg-gray-100`}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={row.stock}
                        onChange={(e) =>
                          patchRow(row.key, { stock: e.target.value })
                        }
                        disabled={!row.enabled}
                        inputMode="numeric"
                        autoComplete="off"
                        aria-label={`مخزون ${row.values.join(" / ")}`}
                        className={`${inputClass} disabled:bg-gray-100`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            شيل علامة ✓ من التركيبات اللي مش موجودة (مثلًا مقاس XL باللون
            الأحمر).
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
