import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Card, CardBody } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  Megaphone,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileDown,
  Sparkles,
} from 'lucide-react';

export function PengumumanWarga() {
  const { announcements, events } = useApp();
  const [activeTab, setActiveTab] = useState('semua'); // semua, pengumuman, agenda
  const [selectedItem, setSelectedItem] = useState(null);

  const publishedAnnouncements = announcements.filter(a => a.status === 'Dipublikasikan');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Warta & Agenda Kegiatan Warga
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Informasi resmi lingkungan, jadwal kerja bakti, posyandu, dan agenda RT 01 / RW 05.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
        <button
          onClick={() => setActiveTab('semua')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'semua'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semua Informasi
        </button>
        <button
          onClick={() => setActiveTab('pengumuman')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'pengumuman'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Pengumuman ({publishedAnnouncements.length})
        </button>
        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'agenda'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Agenda Kegiatan ({events.length})
        </button>
      </div>

      {/* Announcements Section */}
      {(activeTab === 'semua' || activeTab === 'pengumuman') && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Pengumuman Lingkungan Terkini</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedAnnouncements.map((ann) => (
              <Card key={ann.id} hover className="flex flex-col justify-between">
                <CardBody className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge status="Baru" label={ann.priority} size="sm" />
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {formatDate(ann.date)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-3 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Target: <strong className="text-slate-600 dark:text-slate-300">{ann.targetRegion}</strong></span>
                    <button
                      onClick={() => setSelectedItem({ type: 'announcement', data: ann })}
                      className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
                    >
                      Baca Selengkapnya
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Events / Agenda Section */}
      {(activeTab === 'semua' || activeTab === 'agenda') && (
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Kalender Kegiatan & Agenda Warga</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <Card key={evt.id} hover>
                <CardBody className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">
                      {evt.category}
                    </span>
                    <Badge status={evt.status} size="sm" />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(evt.date, true)}, {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Penyelenggara: {evt.organizer}</span>
                    <button
                      onClick={() => setSelectedItem({ type: 'event', data: evt })}
                      className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
                    >
                      Rincian Agenda
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.type === 'announcement' ? 'Detail Pengumuman' : 'Detail Agenda Kegiatan'}
        footer={
          <Button variant="secondary" onClick={() => setSelectedItem(null)}>
            Tutup
          </Button>
        }
      >
        {selectedItem?.type === 'announcement' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <Badge status="Baru" label={selectedItem.data.priority} />
              <span className="text-slate-400 dark:text-slate-500">Dipublikasikan: {formatDate(selectedItem.data.date)}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {selectedItem.data.title}
            </h3>
            <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 text-sm">
              {selectedItem.data.content}
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <p>Penulis: <strong>{selectedItem.data.author}</strong></p>
              <p>Wilayah Sasaran: <strong>{selectedItem.data.targetRegion}</strong></p>
            </div>
          </div>
        )}

        {selectedItem?.type === 'event' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <Badge status={selectedItem.data.status} />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {selectedItem.data.title}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              {selectedItem.data.description}
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-800">
              <p><strong className="text-slate-800 dark:text-slate-200">Waktu:</strong> {formatDate(selectedItem.data.date, true)}, {selectedItem.data.time}</p>
              <p><strong className="text-slate-800 dark:text-slate-200">Lokasi:</strong> {selectedItem.data.location}</p>
              <p><strong className="text-slate-800 dark:text-slate-200">Penyelenggara:</strong> {selectedItem.data.organizer}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
