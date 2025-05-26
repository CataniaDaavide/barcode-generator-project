"use client";

import { useState, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function BarcodesPage() {
  const [input, setInput] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const raw = event.target?.result;
      if (typeof raw === "string") {
        const content = raw.replace(/\s+/g, "");
        setInput(""); // forza il reset se è identico
        setTimeout(() => setInput(content), 0);
      }

      fileInputRef.current.value = "";
    };

    reader.onerror = (err) => {
      console.error("Errore nella lettura del file:", err);
    };

    reader.readAsText(file, "UTF-8");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value.replace(/\s+/g, ""));
  };

  const generateBarcodes = () => {
    const codes = input
      .replace(/\s+/g, "")
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean);

    const newBarcodes = codes.map((code) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode(svg, code, {
        format: "CODE128",
        displayValue: false,
        height: 30,
        width: 2,
        margin: 0,
      });

      return {
        svg: new XMLSerializer().serializeToString(svg),
        code,
      };
    });

    setBarcodes(newBarcodes);
  };

  return (
    <div className="min-h-screen flex flex-col gap-3 bg-zinc-900 text-white p-3 md:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl text-amber-500 font-bold">
          Generatore di Barcode
        </h1>
        <textarea
          className="w-full p-2 border border-amber-500 rounded-lg outline-none"
          rows={4}
          placeholder="Inserisci codici separati da virgola"
          value={input}
          onChange={handleChange}
          // onKeyUp={handleKeyUp}
        />

        <div className="flex gap-3">
          <button
            className="w-42 px-4 py-2 bg-amber-500 rounded hover:bg-amber-600 cursor-pointer active:scale-[0.95]"
            onClick={generateBarcodes}
          >
            Genera
          </button>
          <button
            className="w-42 px-4 py-2 bg-zinc-500 rounded hover:bg-zinc-600 cursor-pointer active:scale-[0.95]"
            onClick={() => fileInputRef.current?.click()}
          >
            Carica file .txt
          </button>
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-20 xl:grid-cols-6 gap-4 items-center justify-center md:justify-start pt-5">
        {barcodes.map(({ svg, code }, idx) => (
          <div
            key={idx}
            className="w-full md:w-auto flex flex-col items-center justify-center"
          >
            <div className="w-full bg-amber-500 text-center p-1 rounded-t-lg">
              <p className="font-semibold">{code}</p>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: svg }}
              className="w-full flex justify-center bg-white p-3 rounded-b-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
