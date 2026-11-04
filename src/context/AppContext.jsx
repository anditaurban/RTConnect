import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  MOCK_USERS,
  MOCK_REGIONS,
  MOCK_RESIDENTS,
  MOCK_FAMILIES,
  MOCK_LETTER_TYPES,
  MOCK_LETTER_REQUESTS,
  MOCK_FINANCE_TRANSACTIONS,
  MOCK_DUES_TYPES,
  MOCK_DUES_BILLS,
  MOCK_ANNOUNCEMENTS,
  MOCK_COMPLAINTS,
  MOCK_EVENTS,
  MOCK_ASSETS,
  MOCK_REGION_SETTINGS,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme state: light vs dark
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('rtconnect_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rtconnect_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Current user & role selection
  const [activeRole, setActiveRole] = useState('warga'); // default to warga
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.find(u => u.role === 'warga'));

  // Live state for mock data
  const [residents, setResidents] = useState(MOCK_RESIDENTS);
  const [families, setFamilies] = useState(MOCK_FAMILIES);
  const [letterRequests, setLetterRequests] = useState(MOCK_LETTER_REQUESTS);
  const [letterTypes, setLetterTypes] = useState(MOCK_LETTER_TYPES);
  const [financeTransactions, setFinanceTransactions] = useState(MOCK_FINANCE_TRANSACTIONS);
  const [duesBills, setDuesBills] = useState(MOCK_DUES_BILLS);
  const [duesTypes, setDuesTypes] = useState(MOCK_DUES_TYPES);
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [regionSettings, setRegionSettings] = useState(MOCK_REGION_SETTINGS);

  // Global toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const closeToast = () => setToast(null);

  // Switch demo role helper
  const switchRole = (roleKey) => {
    const user = MOCK_USERS.find(u => u.role === roleKey) || MOCK_USERS[0];
    setActiveRole(roleKey);
    setCurrentUser(user);
    showToast('info', `Beralih ke mode demo: ${user.name} (${user.roleLabel})`);
  };

  // --- ACTIONS ---

  // 1. Resident Actions (Tambah, Edit, Hapus)
  const addResident = (data) => {
    const newRes = {
      ...data,
      id: `res-${Date.now()}`,
      statusKependudukan: 'Aktif',
    };
    setResidents(prev => [newRes, ...prev]);
    showToast('success', `Data warga ${data.name} berhasil ditambahkan.`);
    return newRes;
  };

  const updateResident = (id, data) => {
    setResidents(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    showToast('success', 'Data warga berhasil diperbarui.');
  };

  const deleteResident = (id) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    showToast('warning', 'Data warga berhasil dihapus.');
  };

  // 2. Letters Actions (Tambah, Edit, Review, Hapus)
  const addLetterRequest = (requestData) => {
    const letterType = letterTypes.find(t => t.id === requestData.letterTypeId);
    const newReq = {
      id: `req-${Date.now()}`,
      letterTypeId: requestData.letterTypeId,
      letterName: letterType ? letterType.name : 'Surat Administrasi',
      residentId: currentUser.id === 'user-warga1' ? 'res-01' : 'res-01',
      residentName: currentUser.name,
      nik: currentUser.nik || '3171011508890002',
      noKK: currentUser.noKK || '3171012309870001',
      rt: 'RT 01',
      rw: 'RW 05',
      purpose: requestData.purpose,
      referenceNo: `REQ/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
      letterNumber: null,
      status: 'Diajukan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewedBy: null,
      approvedBy: null,
      notes: 'Permohonan baru, menunggu verifikasi pengurus.',
      attachments: requestData.attachments || [{ name: 'Dokumen_Lampiran.pdf', size: '1.2 MB' }],
      timeline: [
        {
          status: 'Diajukan',
          date: new Date().toISOString(),
          note: 'Permohonan diajukan oleh pemohon.',
        },
      ],
    };
    setLetterRequests(prev => [newReq, ...prev]);
    showToast('success', `Surat permohonan berhasil dikirim dengan no ref: ${newReq.referenceNo}`);
    return newReq;
  };

  const updateLetterRequest = (id, data) => {
    setLetterRequests(prev => prev.map(req => {
      if (req.id !== id) return req;
      return {
        ...req,
        ...data,
        updatedAt: new Date().toISOString(),
        timeline: [
          ...req.timeline,
          {
            status: 'Diperbarui',
            date: new Date().toISOString(),
            note: 'Data permohonan surat diperbaiki oleh pemohon.',
          },
        ],
      };
    }));
    showToast('success', 'Perubahan permohonan surat berhasil dikirim.');
  };

  const reviewLetterRequest = (id, newStatus, notes, letterNumber = null) => {
    setLetterRequests(prev => prev.map(req => {
      if (req.id !== id) return req;

      const generatedNumber = (newStatus === 'Disetujui' && !letterNumber)
        ? `470/${String(Math.floor(10 + Math.random() * 90))}/RT.01-RW.05/${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][new Date().getMonth()]}/${new Date().getFullYear()}`
        : letterNumber || req.letterNumber;

      const updated = {
        ...req,
        status: newStatus,
        notes: notes || req.notes,
        letterNumber: generatedNumber,
        updatedAt: new Date().toISOString(),
        reviewedBy: currentUser.name,
        approvedBy: newStatus === 'Disetujui' ? currentUser.name : req.approvedBy,
        timeline: [
          ...req.timeline,
          {
            status: newStatus,
            date: new Date().toISOString(),
            note: notes || `Status diubah menjadi ${newStatus} oleh ${currentUser.name}.`,
          },
        ],
      };
      return updated;
    }));
    showToast('success', `Status pengajuan surat berhasil diperbarui menjadi "${newStatus}".`);
  };

  const deleteLetterRequest = (id) => {
    setLetterRequests(prev => prev.filter(r => r.id !== id));
    showToast('warning', 'Pengajuan surat berhasil dibatalkan / dihapus.');
  };

  // 3. Finance Actions (Tambah, Edit, Void/Batal)
  const addFinanceTransaction = (data) => {
    const newTx = {
      ...data,
      id: `fin-${Date.now()}`,
      recordedBy: `${currentUser.name} (${currentUser.roleLabel})`,
      rt: 'RT 01',
      rw: 'RW 05',
    };
    setFinanceTransactions(prev => [newTx, ...prev]);
    showToast('success', `Transaksi kas ${data.type === 'in' ? 'masuk' : 'keluar'} berhasil dicatat.`);
  };

  const updateFinanceTransaction = (id, data) => {
    setFinanceTransactions(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        ...data,
        auditNote: `${data.auditNote || 'Koreksi transaksi'} (diubah oleh ${currentUser.name})`,
      };
    }));
    showToast('success', 'Data transaksi kas berhasil diperbarui.');
  };

  const voidFinanceTransaction = (id, reason) => {
    // SOT Anti-delete rule: financial records are marked VOID with audit reason
    setFinanceTransactions(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        category: `[BATAL/VOID] ${t.category}`,
        amount: 0,
        auditNote: `Dibatalkan oleh ${currentUser.name}. Alasan: ${reason}`,
      };
    }));
    showToast('warning', 'Transaksi kas berhasil dibatalkan (void) dengan catatan audit.');
  };

  // 4. Dues Actions (Tambah Tagihan, Edit, Hapus, Bayar, Verifikasi, Kelola Tarif)
  const addDuesBill = (data) => {
    const newBill = {
      ...data,
      id: `bill-${Date.now()}`,
      status: 'Belum Dibayar',
      paymentMethod: null,
      paymentDate: null,
      paymentProofUrl: null,
      verificationNotes: null,
    };
    setDuesBills(prev => [newBill, ...prev]);
    showToast('success', `Tagihan iuran ${data.duesName} berhasil dibuat.`);
  };

  const updateDuesBill = (id, data) => {
    setDuesBills(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    showToast('success', 'Data tagihan iuran berhasil diperbarui.');
  };

  const deleteDuesBill = (id) => {
    setDuesBills(prev => prev.filter(b => b.id !== id));
    showToast('warning', 'Tagihan iuran berhasil dihapus.');
  };

  const addDuesType = (data) => {
    const newType = {
      ...data,
      id: `dt-${Date.now()}`,
      active: true,
    };
    setDuesTypes(prev => [...prev, newType]);
    showToast('success', `Jenis iuran ${data.name} berhasil ditambahkan.`);
  };

  const updateDuesType = (id, data) => {
    setDuesTypes(prev => prev.map(dt => dt.id === id ? { ...dt, ...data } : dt));
    showToast('success', 'Tarif jenis iuran berhasil diperbarui.');
  };

  const deleteDuesType = (id) => {
    setDuesTypes(prev => prev.filter(dt => dt.id !== id));
    showToast('warning', 'Jenis iuran berhasil dihapus.');
  };

  const payDuesBill = (billId, paymentMethod, proofUrl) => {
    setDuesBills(prev => prev.map(b => {
      if (b.id !== billId) return b;
      return {
        ...b,
        status: 'Menunggu Verifikasi',
        paymentMethod,
        paymentDate: new Date().toISOString(),
        paymentProofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
        verificationNotes: 'Menunggu verifikasi pembayaran oleh bendahara.',
      };
    }));
    showToast('success', 'Bukti pembayaran berhasil diunggah dan sedang diverifikasi bendahara.');
  };

  const verifyDuesBill = (billId, isApproved, notes) => {
    setDuesBills(prev => prev.map(b => {
      if (b.id !== billId) return b;
      const targetBill = b;
      const newStatus = isApproved ? 'Lunas' : 'Belum Dibayar';
      
      // If approved, automatically record in Kas Masuk
      if (isApproved) {
        addFinanceTransaction({
          date: new Date().toISOString().split('T')[0],
          type: 'in',
          category: 'Iuran Warga',
          amount: targetBill.amount,
          description: `Pembayaran iuran ${targetBill.duesName} - an. ${targetBill.residentName} (${targetBill.billNumber})`,
          receiptUrl: targetBill.paymentProofUrl,
          auditNote: `Diverifikasi oleh ${currentUser.name}`,
        });
      }

      return {
        ...b,
        status: newStatus,
        verificationNotes: notes || (isApproved ? 'Pembayaran telah diverifikasi sah.' : 'Bukti pembayaran ditolak. Silakan unggah bukti yang sesuai.'),
      };
    }));
    showToast(isApproved ? 'success' : 'warning', isApproved ? 'Pembayaran berhasil diverifikasi lunas.' : 'Pembayaran ditolak.');
  };

  // 5. Announcements Actions (Tambah, Edit, Hapus)
  const addAnnouncement = (data) => {
    const newAnn = {
      ...data,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString(),
      author: `${currentUser.name} (${currentUser.roleLabel})`,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast('success', 'Pengumuman baru berhasil diterbitkan.');
  };

  const updateAnnouncement = (id, data) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('success', 'Pengumuman berhasil diperbarui.');
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('warning', 'Pengumuman berhasil dihapus.');
  };

  // 6. Complaints Actions (Tambah, Edit, Tanggapi, Hapus)
  const addComplaint = (data) => {
    const newCmp = {
      ...data,
      id: `cmp-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterPhone: currentUser.phone || '0812-8899-0011',
      rt: 'RT 01',
      status: 'Baru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: null,
      responses: [],
    };
    setComplaints(prev => [newCmp, ...prev]);
    showToast('success', 'Aspirasi/pengaduan Anda berhasil dikirim ke pengurus RT.');
  };

  const updateComplaint = (id, data) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
    showToast('success', 'Laporan aduan berhasil diperbarui.');
  };

  const respondToComplaint = (id, responseText, newStatus, assignedTo) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = {
        ...c,
        status: newStatus || c.status,
        assignedTo: assignedTo !== undefined ? assignedTo : c.assignedTo,
        updatedAt: new Date().toISOString(),
        responses: [
          ...c.responses,
          {
            author: `${currentUser.name} (${currentUser.roleLabel})`,
            date: new Date().toISOString(),
            message: responseText,
          },
        ],
      };
      return updated;
    }));
    showToast('success', 'Tanggapan dan status pengaduan berhasil diperbarui.');
  };

  const deleteComplaint = (id) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
    showToast('warning', 'Laporan pengaduan berhasil dihapus.');
  };

  // 7. Events Actions (Tambah, Edit, Hapus)
  const addEvent = (data) => {
    const newEvt = {
      ...data,
      id: `evt-${Date.now()}`,
      status: 'Akan Datang',
      attendeesCount: 0,
    };
    setEvents(prev => [newEvt, ...prev]);
    showToast('success', 'Agenda kegiatan berhasil dijadwalkan.');
  };

  const updateEvent = (id, data) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast('success', 'Agenda kegiatan berhasil diperbarui.');
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('warning', 'Agenda kegiatan berhasil dihapus.');
  };

  // 8. Assets Actions (Tambah, Edit, Hapus)
  const addAsset = (data) => {
    const newAst = {
      ...data,
      id: `ast-${Date.now()}`,
    };
    setAssets(prev => [newAst, ...prev]);
    showToast('success', 'Inventaris aset lingkungan berhasil ditambahkan.');
  };

  const updateAsset = (id, data) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('success', 'Data inventaris berhasil diperbarui.');
  };

  const deleteAsset = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    showToast('warning', 'Data inventaris berhasil dihapus.');
  };

  // 9. Settings Action
  const updateRegionSettings = (newSettings) => {
    setRegionSettings(prev => ({ ...prev, ...newSettings }));
    showToast('success', 'Pengaturan profil wilayah berhasil disimpan.');
  };

  // Financial calculations memo
  const financeSummary = useMemo(() => {
    const totalIn = financeTransactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalOut = financeTransactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const balance = totalIn - totalOut;

    const pendingDuesCount = duesBills.filter(b => b.status === 'Menunggu Verifikasi').length;
    const unpaidDuesAmount = duesBills
      .filter(b => b.status === 'Belum Dibayar' || b.status === 'Terlambat')
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    return {
      totalIn,
      totalOut,
      balance,
      pendingDuesCount,
      unpaidDuesAmount,
    };
  }, [financeTransactions, duesBills]);

  const value = {
    // Theme
    theme,
    toggleTheme,
    // Auth & Role
    currentUser,
    activeRole,
    switchRole,
    // Data collections
    residents,
    families,
    letterRequests,
    letterTypes,
    financeTransactions,
    duesBills,
    duesTypes,
    announcements,
    complaints,
    events,
    assets,
    regionSettings,
    financeSummary,
    // Actions: Resident
    addResident,
    updateResident,
    deleteResident,
    // Actions: Letters
    addLetterRequest,
    updateLetterRequest,
    reviewLetterRequest,
    deleteLetterRequest,
    // Actions: Finance
    addFinanceTransaction,
    updateFinanceTransaction,
    voidFinanceTransaction,
    // Actions: Dues
    addDuesBill,
    updateDuesBill,
    deleteDuesBill,
    addDuesType,
    updateDuesType,
    deleteDuesType,
    payDuesBill,
    verifyDuesBill,
    // Actions: Content
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addComplaint,
    updateComplaint,
    respondToComplaint,
    deleteComplaint,
    addEvent,
    updateEvent,
    deleteEvent,
    addAsset,
    updateAsset,
    deleteAsset,
    updateRegionSettings,
    // Toast
    toast,
    showToast,
    closeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
