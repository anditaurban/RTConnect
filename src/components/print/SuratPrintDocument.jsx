import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Printer, X } from 'lucide-react';
import { Button } from '../common/Button';

export function SuratPrintDocument({ letterRequest, onClose }) {
  const { regionSettings } = useApp();

  if (!letterRequest) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Toolbar (hidden on print) */}
        <div className="no-print p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pratinjau Surat Resmi
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
              Siap Cetak
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" icon={Printer} onClick={handlePrint}>
              Cetak Dokumen / Simpan PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Sheet */}
        <div className="p-8 sm:p-12 overflow-y-auto font-serif text-black leading-relaxed print-page bg-white select-text">
          {/* Official Letter Header (Kop Surat) */}
          <div className="text-center pb-4 border-b-4 border-double border-black">
            <h4 className="text-sm font-bold uppercase tracking-wide">
              {regionSettings.letterHeader.government}
            </h4>
            <h4 className="text-sm font-bold uppercase tracking-wide">
              {regionSettings.letterHeader.district}
            </h4>
            <h3 className="text-base font-extrabold uppercase tracking-wider mt-0.5">
              {regionSettings.letterHeader.neighborhood}
            </h3>
            <p className="text-xs italic font-sans text-slate-600 mt-1">
              {regionSettings.letterHeader.address}
            </p>
          </div>

          {/* Letter Title & Number */}
          <div className="text-center my-6">
            <h2 className="text-base font-bold uppercase underline tracking-wider">
              {letterRequest.letterName}
            </h2>
            <p className="text-xs font-sans mt-1">
              Nomor: {letterRequest.letterNumber || '470/___/RT.01-RW.05/VIII/2026'}
            </p>
          </div>

          {/* Opening text */}
          <p className="text-sm text-justify mb-4">
            Yang bertanda tangan di bawah ini, Pengurus Rukun Tetangga (RT) 01 Rukun Warga (RW) 05 Kelurahan Kebon Jeruk, Kecamatan Kebon Jeruk, Jakarta Barat, dengan ini menerangkan bahwa:
          </p>

          {/* Resident Details Table */}
          <div className="my-4 text-sm font-sans space-y-2 pl-4">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-700">Nama Lengkap</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7 font-bold">{letterRequest.residentName}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-700">Nomor Induk Kependudukan (NIK)</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7 font-mono font-medium">{letterRequest.nik}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-700">Nomor Kartu Keluarga (KK)</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7 font-mono font-medium">{letterRequest.noKK}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-700">Tempat, Tanggal Lahir</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7">Jakarta, 15 Agustus 1989</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-700">Jenis Kelamin / Agama</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7">Laki-laki / Islam</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-700">Pekerjaan</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7">Karyawan Swasta</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-4 text-slate-700">Alamat KTP / Domisili</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7">Jl. Mawar Indah Blok B2 No. 14, RT 01 / RW 05</span>
            </div>
          </div>

          {/* Purpose & Content */}
          <div className="my-5 text-sm text-justify space-y-3">
            <p>
              Bahwa nama tersebut di atas adalah benar-benar warga yang bertempat tinggal dan berdomisili di lingkungan RT 01 / RW 05 Kelurahan Kebon Jeruk, Kecamatan Kebon Jeruk, Jakarta Barat, dan tercatat berkelakuan baik di lingkungan masyarakat.
            </p>
            <p>
              Surat keterangan ini diberikan kepada yang bersangkutan untuk keperluan:{' '}
              <span className="font-bold underline">{letterRequest.purpose}</span>.
            </p>
            <p>
              Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya sesuai ketentuan yang berlaku.
            </p>
          </div>

          {/* Signature Block */}
          <div className="mt-10 grid grid-cols-2 text-center text-xs font-sans">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-bold mt-1">Ketua RW 05 Melati Asri</p>
              <div className="h-16 flex items-center justify-center italic text-slate-300">
                (Tanda Tangan)
              </div>
              <p className="font-bold underline">Bpk. Bambang Sutrisno</p>
            </div>
            <div>
              <p className="text-slate-700">Jakarta, {formatDate(letterRequest.updatedAt || letterRequest.createdAt)}</p>
              <p className="font-bold mt-1">Ketua RT 01 / RW 05</p>
              <div className="h-16 flex items-center justify-center relative">
                {/* Stamp visual */}
                <div className="w-16 h-16 rounded-full border-2 border-brand-500/40 text-brand-600/40 text-[9px] font-bold flex items-center justify-center rotate-[-15deg] uppercase">
                  STEMPEL RT 01
                </div>
              </div>
              <p className="font-bold underline">Bpk. Joko Widodo Mulyono</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

