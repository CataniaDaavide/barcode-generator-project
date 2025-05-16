'use client'

import { useState } from 'react'
import JsBarcode from 'jsbarcode'

export default function BarcodesPage() {
  const [input, setInput] = useState('')
  const [barcodes, setBarcodes] = useState([])

  const handleKeyUp = (e) => {
    if(e.key === "Enter"){
      generateBarcodes()
      return
    }
  }

  const generateBarcodes = () => {
    const codes = input.split(',').map(code => code.trim()).filter(Boolean)
    const newBarcodes = []

    codes.forEach(code => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      JsBarcode(svg, code, {
        format: 'CODE128',
        displayValue: false,
        height: 30,
        width: 2,
        margin: 0,
      })
      newBarcodes.push({
        svg: new XMLSerializer().serializeToString(svg),
        code,
      })
    })

    setBarcodes(newBarcodes)
  }

  return (
    <div className="min-h-screen flex flex-col gap-3 bg-zinc-900 text-white p-3">
      <div className='flex flex-col gap-4'>
        <h1 className="text-5xl text-amber-500 font-bold">Generatore di Barcode</h1>
        <textarea
          className="w-full md:w-[500px] p-2 border border-amber-500 rounded-lg outline-none"
          rows={4}
          placeholder="Inserisci codici separati da virgola"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleKeyUp}
        />

      </div>
      <button
        className="w-42 px-4 py-2 bg-amber-500 rounded hover:bg-amber-600 cursor-pointer active:scale-[0.95]"
        onClick={generateBarcodes}
      >
        Genera
      </button>

      <div className="w-full flex flex-wrap gap-12 items-center justify-center md:justify-start pt-5">
        {barcodes.map(({ svg, code }, idx) => (
          <div key={idx} className="w-full md:w-auto flex flex-col items-center justify-center">
            <div className='w-full bg-amber-500 text-center p-1 rounded-t-lg'>
              <p className="font-semibold">{code}</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: svg }} className='w-full flex justify-center bg-white p-3 rounded-b-lg'/>
          </div>
        ))}
      </div>
    </div>
  )
}
