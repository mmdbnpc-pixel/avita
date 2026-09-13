import { useState } from 'react';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { cities } from '@/data/cities';

interface CitySelectProps {
  label?: string;
  value: string;
  onChange: (city: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function CitySelect({ label = 'شهر', value, onChange, error, disabled = false }: CitySelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {label && <label className="mb-2 block text-sm font-medium text-navy-900">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`relative flex w-full items-center rounded-xl border bg-white px-4 py-3 text-right text-sm text-navy-900 outline-none transition-all ${
          error ? 'border-red-400' : 'border-ivory-300'
        } ${disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'cursor-pointer hover:border-navy-900'}`}
      >
        <MapPin className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
        <span className={value ? 'text-navy-900' : 'text-gray-400'}>{value || 'انتخاب شهر'}</span>
        <ChevronDown className={`mr-auto h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && !disabled && (
        <>
          <button type="button" aria-label="بستن انتخاب شهر" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-ivory-200 bg-white shadow-xl">
            <div className="max-h-60 overflow-y-auto overscroll-contain py-1" role="listbox">
              {cities.map((city) => (
                <button
                  key={city.label}
                  type="button"
                  onClick={() => {
                    onChange(city.label);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-right text-sm transition-colors ${
                    value === city.label ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-ivory-100'
                  }`}
                >
                  <span>{city.label}</span>
                  {value === city.label && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
