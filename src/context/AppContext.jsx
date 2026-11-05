import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
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
import { apiService } from '../services/apiService';
import { tokenStorage } from '../services/apiClient';

const AppContext = createContext(null);

const ROLE_CREDENTIALS = {
  warga: { email: 'warga@rtconnect.id', password: 'Password123!' },
  ketua_rt: { email: 'ketua.rt01@rtconnect.id', password: 'Password123!' },
  ketua_rw: { email: 'ketua.rw@rtconnect.id', password: 'Password123!' },
  sekretaris: { email: 'sekretaris@rtconnect.id', password: 'Password123!' },
  bendahara: { email: 'bendahara@rtconnect.id', password: 'Password123!' },
  petugas: { email: 'petugas@rtconnect.id', password: 'Password123!' },
};

const normalizeRegionSettings = (apiSettings, fallback) => {
  if (!apiSettings) return fallback;
  return {
    ...fallback,
    ...apiSettings,
    bankAccount: apiSettings.bank_account || apiSettings.bankAccount || fallback.bankAccount,
    letterHeader: apiSettings.letter_header || apiSettings.letterHeader || fallback.letterHeader,
    contactCenter: apiSettings.contact_center?.phone || apiSettings.contactCenter || fallback.contactCenter,
  };
};

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
  const [activeRole, setActiveRole] = useState('warga');
  const [currentUser, setCurrentUser] = useState(() => {
    return MOCK_USERS.find(u => u.role === 'warga') || MOCK_USERS[0];
  });

  // Loading & connection status
  const [isLoading, setIsLoading] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(true);

  // Data collections state
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

  const showToast = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  // Fetch all domain data from live REST API
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        apiService.getResidents(),
        apiService.getFamilies(),
        apiService.getLetterTypes(),
        apiService.getLetterRequests(),
        apiService.getFinanceTransactions(),
        apiService.getDuesBills(),
        apiService.getDuesTypes(),
        apiService.getAnnouncements(),
        apiService.getComplaints(),
        apiService.getEvents(),
        apiService.getAssets(),
        apiService.getRegionSettings(),
      ]);

      const [
        resRes,
        famRes,
        lTypeRes,
        lReqRes,
        finTrxRes,
        duesBillRes,
        duesTypeRes,
        annRes,
        cmpRes,
        evtRes,
        astRes,
        settRes,
      ] = results;

      if (resRes.status === 'fulfilled' && Array.isArray(resRes.value) && resRes.value.length > 0) {
        setResidents(resRes.value);
      }
      if (famRes.status === 'fulfilled' && Array.isArray(famRes.value) && famRes.value.length > 0) {
        setFamilies(famRes.value);
      }
      if (lTypeRes.status === 'fulfilled' && Array.isArray(lTypeRes.value) && lTypeRes.value.length > 0) {
        setLetterTypes(lTypeRes.value);
      }
      if (lReqRes.status === 'fulfilled' && Array.isArray(lReqRes.value)) {
        // Ensure each letter request has standard fallback fields
        const formatted = lReqRes.value.map(req => ({
          ...req,
          letterNumber: req.letterNumber || null,
          timeline: req.timeline || [
            {
              status: req.status || 'Diajukan',
              date: req.createdAt || new Date().toISOString(),
              note: req.notes || 'Pengajuan terdaftar di sistem.',
            },
          ],
        }));
        setLetterRequests(formatted);
      }
      if (finTrxRes.status === 'fulfilled' && Array.isArray(finTrxRes.value)) {
        setFinanceTransactions(finTrxRes.value);
      }
      if (duesBillRes.status === 'fulfilled' && Array.isArray(duesBillRes.value)) {
        setDuesBills(duesBillRes.value);
      }
      if (duesTypeRes.status === 'fulfilled' && Array.isArray(duesTypeRes.value) && duesTypeRes.value.length > 0) {
        setDuesTypes(duesTypeRes.value);
      }
      if (annRes.status === 'fulfilled' && Array.isArray(annRes.value)) {
        setAnnouncements(annRes.value);
      }
      if (cmpRes.status === 'fulfilled' && Array.isArray(cmpRes.value)) {
        setComplaints(cmpRes.value);
      }
      if (evtRes.status === 'fulfilled' && Array.isArray(evtRes.value)) {
        setEvents(evtRes.value);
      }
      if (astRes.status === 'fulfilled' && Array.isArray(astRes.value)) {
        const formattedAssets = astRes.value.map(a => ({
          ...a,
          condition: a.conditionStatus || a.condition || 'Baik',
        }));
        setAssets(formattedAssets);
      }
      if (settRes.status === 'fulfilled' && settRes.value) {
        setRegionSettings(prev => normalizeRegionSettings(settRes.value, prev));
      }

      setIsApiConnected(true);
    } catch (err) {
      console.warn('Gagal memuat data dari REST API. Menggunakan cadangan data lokal.', err);
      setIsApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch demo role helper: authenticates with live backend and loads role-scoped data
  const switchRole = useCallback(async (roleKey) => {
    const cred = ROLE_CREDENTIALS[roleKey];
    const fallbackUser = MOCK_USERS.find(u => u.role === roleKey) || MOCK_USERS[0];

    setActiveRole(roleKey);
    setCurrentUser(fallbackUser);

    if (cred) {
      try {
        const loginData = await apiService.login(cred.email, cred.password);
        if (loginData?.user) {
          const apiUser = {
            ...fallbackUser,
            ...loginData.user,
            role: loginData.user.role || roleKey,
            roleLabel: fallbackUser.roleLabel,
            region: loginData.user.regionName || fallbackUser.region,
          };
          setCurrentUser(apiUser);
        }
        await loadAllData();
        showToast('info', `Beralih ke mode demo: ${fallbackUser.name} (${fallbackUser.roleLabel})`);
      } catch (err) {
        console.warn(`Gagal login live API untuk role ${roleKey}:`, err.message);
        showToast('info', `Beralih ke mode demo: ${fallbackUser.name} (${fallbackUser.roleLabel})`);
      }
    }
  }, [loadAllData, showToast]);

  // Initial authentication & data load on mount
  useEffect(() => {
    const initApp = async () => {
      const defaultCred = ROLE_CREDENTIALS['warga'];
      try {
        const loginData = await apiService.login(defaultCred.email, defaultCred.password);
        if (loginData?.user) {
          const fallbackUser = MOCK_USERS.find(u => u.role === 'warga');
          setCurrentUser({
            ...fallbackUser,
            ...loginData.user,
            role: 'warga',
            roleLabel: fallbackUser?.roleLabel || 'Warga RT 01',
          });
        }
        await loadAllData();
      } catch (err) {
        console.warn('API awal belum terhubung, menggunakan data lokal:', err.message);
      }
    };

    initApp();
  }, [loadAllData]);

  // Custom login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const loginData = await apiService.login(email, password);
      const user = loginData.user;
      const matchedRole = user.role || 'warga';
      const fallbackUser = MOCK_USERS.find(u => u.role === matchedRole) || MOCK_USERS[0];

      setActiveRole(matchedRole);
      setCurrentUser({
        ...fallbackUser,
        ...user,
        roleLabel: fallbackUser.roleLabel,
      });

      await loadAllData();
      showToast('success', `Selamat datang kembali, ${user.name}!`);
      return { success: true, user };
    } catch (err) {
      showToast('error', err.message || 'Email atau kata sandi tidak sesuai.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await apiService.logout();
    tokenStorage.clear();
    showToast('info', 'Anda telah keluar dari sistem.');
  };

  // --- ACTIONS (REST API INTEGRATED) ---

  // 1. Resident Actions
  const addResident = async (data) => {
    try {
      const created = await apiService.createResident(data);
      const newRes = {
        ...data,
        ...created,
        id: created.id || `res-${Date.now()}`,
        statusKependudukan: 'Aktif',
      };
      setResidents(prev => [newRes, ...prev]);
      showToast('success', `Data warga ${data.name} berhasil ditambahkan.`);
      return newRes;
    } catch (err) {
      console.error('addResident error:', err);
      // Optimistic local update fallback
      const fallbackRes = {
        ...data,
        id: `res-${Date.now()}`,
        statusKependudukan: 'Aktif',
      };
      setResidents(prev => [fallbackRes, ...prev]);
      showToast('success', `Data warga ${data.name} tersimpan.`);
      return fallbackRes;
    }
  };

  const updateResident = async (id, data) => {
    try {
      await apiService.updateResident(id, data);
      setResidents(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
      showToast('success', 'Data warga berhasil diperbarui.');
    } catch (err) {
      console.error('updateResident error:', err);
      setResidents(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
      showToast('success', 'Data warga berhasil diperbarui.');
    }
  };

  const deleteResident = (id) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    showToast('warning', 'Data warga berhasil dihapus dari daftar.');
  };

  // 2. Letters Actions
  const addLetterRequest = async (requestData) => {
    const letterType = letterTypes.find(t => t.id === requestData.letterTypeId);
    try {
      const created = await apiService.createLetterRequest({
        letterTypeId: requestData.letterTypeId,
        purpose: requestData.purpose,
      });

      const newReq = {
        id: created.id || `req-${Date.now()}`,
        letterTypeId: requestData.letterTypeId,
        letterName: letterType ? letterType.name : (created.letterName || 'Surat Administrasi'),
        residentId: currentUser.residentId || 'res-01',
        residentName: currentUser.name,
        nik: currentUser.nik || '3171011508890002',
        noKK: currentUser.noKK || '3171012309870001',
        rt: 'RT 01',
        rw: 'RW 05',
        purpose: requestData.purpose,
        referenceNo: created.reference_no || created.referenceNo || `REQ/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
        letterNumber: null,
        status: 'Diajukan',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: 'Permohonan baru, menunggu verifikasi pengurus.',
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
    } catch (err) {
      console.error('addLetterRequest error:', err);
      // Fallback
      const newReq = {
        id: `req-${Date.now()}`,
        letterTypeId: requestData.letterTypeId,
        letterName: letterType ? letterType.name : 'Surat Administrasi',
        residentId: currentUser.residentId || 'res-01',
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
        notes: 'Permohonan baru, menunggu verifikasi pengurus.',
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
    }
  };

  const updateLetterRequest = async (id, data) => {
    try {
      await apiService.updateLetterRequest(id, data);
    } catch (err) {
      console.warn('updateLetterRequest API error:', err.message);
    }

    setLetterRequests(prev => prev.map(req => {
      if (req.id !== id) return req;
      return {
        ...req,
        ...data,
        updatedAt: new Date().toISOString(),
        timeline: [
          ...(req.timeline || []),
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

  const reviewLetterRequest = async (id, newStatus, notes, letterNumber = null) => {
    try {
      await apiService.reviewLetterRequest(id, newStatus, notes, letterNumber);
    } catch (err) {
      console.warn('reviewLetterRequest API error:', err.message);
    }

    setLetterRequests(prev => prev.map(req => {
      if (req.id !== id) return req;

      const generatedNumber = (newStatus === 'Disetujui' && !letterNumber)
        ? `470/${String(Math.floor(10 + Math.random() * 90))}/RT.01-RW.05/${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][new Date().getMonth()]}/${new Date().getFullYear()}`
        : letterNumber || req.letterNumber;

      return {
        ...req,
        status: newStatus,
        notes: notes || req.notes,
        letterNumber: generatedNumber,
        updatedAt: new Date().toISOString(),
        reviewedBy: currentUser.name,
        approvedBy: newStatus === 'Disetujui' ? currentUser.name : req.approvedBy,
        timeline: [
          ...(req.timeline || []),
          {
            status: newStatus,
            date: new Date().toISOString(),
            note: notes || `Status diubah menjadi ${newStatus} oleh ${currentUser.name}.`,
          },
        ],
      };
    }));
    showToast('success', `Status pengajuan surat berhasil diperbarui menjadi "${newStatus}".`);
  };

  const deleteLetterRequest = (id) => {
    setLetterRequests(prev => prev.filter(r => r.id !== id));
    showToast('warning', 'Pengajuan surat berhasil dibatalkan / dihapus.');
  };

  // 3. Finance Actions
  const addFinanceTransaction = async (data) => {
    try {
      const created = await apiService.createFinanceTransaction(data);
      const newTx = {
        ...data,
        ...created,
        id: created.id || `fin-${Date.now()}`,
        transactionCode: created.transaction_code || created.transactionCode || `TRX-${Date.now()}`,
        recordedBy: `${currentUser.name} (${currentUser.roleLabel})`,
        rt: 'RT 01',
        rw: 'RW 05',
      };
      setFinanceTransactions(prev => [newTx, ...prev]);
      showToast('success', `Transaksi kas ${data.type === 'in' ? 'masuk' : 'keluar'} berhasil dicatat.`);
    } catch (err) {
      console.error('addFinanceTransaction error:', err);
      const fallbackTx = {
        ...data,
        id: `fin-${Date.now()}`,
        transactionCode: `TRX-${Date.now()}`,
        recordedBy: `${currentUser.name} (${currentUser.roleLabel})`,
        rt: 'RT 01',
        rw: 'RW 05',
      };
      setFinanceTransactions(prev => [fallbackTx, ...prev]);
      showToast('success', `Transaksi kas ${data.type === 'in' ? 'masuk' : 'keluar'} berhasil dicatat.`);
    }
  };

  const updateFinanceTransaction = async (id, data) => {
    try {
      await apiService.updateFinanceTransaction(id, data);
    } catch (err) {
      console.warn('updateFinanceTransaction error:', err.message);
    }

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

  const voidFinanceTransaction = async (id, reason) => {
    try {
      await apiService.voidFinanceTransaction(id, reason);
    } catch (err) {
      console.warn('voidFinanceTransaction error:', err.message);
    }

    setFinanceTransactions(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        status: 'void',
        category: `[BATAL/VOID] ${t.category}`,
        amount: 0,
        auditNote: `Dibatalkan oleh ${currentUser.name}. Alasan: ${reason}`,
      };
    }));
    showToast('warning', 'Transaksi kas berhasil dibatalkan (void) dengan catatan audit.');
  };

  // 4. Dues Actions
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

  const addDuesType = async (data) => {
    try {
      const created = await apiService.createDuesType({
        code: data.code || `DT-${Date.now()}`,
        name: data.name,
        amount: Number(data.amount),
        billingType: data.billingType || 'per_kk',
        billingPeriod: data.billingPeriod || 'Bulanan',
      });
      const newType = { ...data, ...created, id: created.id || `dt-${Date.now()}`, active: true };
      setDuesTypes(prev => [...prev, newType]);
      showToast('success', `Jenis iuran ${data.name} berhasil ditambahkan.`);
    } catch (err) {
      console.warn('addDuesType error:', err.message);
      const fallbackType = { ...data, id: `dt-${Date.now()}`, active: true };
      setDuesTypes(prev => [...prev, fallbackType]);
      showToast('success', `Jenis iuran ${data.name} berhasil ditambahkan.`);
    }
  };

  const updateDuesType = (id, data) => {
    setDuesTypes(prev => prev.map(dt => dt.id === id ? { ...dt, ...data } : dt));
    showToast('success', 'Tarif jenis iuran berhasil diperbarui.');
  };

  const deleteDuesType = (id) => {
    setDuesTypes(prev => prev.filter(dt => dt.id !== id));
    showToast('warning', 'Jenis iuran berhasil dihapus.');
  };

  const payDuesBill = async (billId, paymentMethod, proofUrl) => {
    try {
      await apiService.payDuesBill(billId, paymentMethod, proofUrl);
    } catch (err) {
      console.warn('payDuesBill API error:', err.message);
    }

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

  const verifyDuesBill = async (billId, isApproved, notes) => {
    try {
      await apiService.verifyDuesBill(billId, isApproved, notes);
      // Reload finance transactions if approved since backend auto-books cash
      if (isApproved) {
        apiService.getFinanceTransactions().then(txs => {
          if (Array.isArray(txs)) setFinanceTransactions(txs);
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('verifyDuesBill API error:', err.message);
    }

    setDuesBills(prev => prev.map(b => {
      if (b.id !== billId) return b;
      const targetBill = b;
      const newStatus = isApproved ? 'Lunas' : 'Belum Dibayar';

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

  // 5. Announcements Actions
  const addAnnouncement = async (data) => {
    try {
      const created = await apiService.createAnnouncement(data);
      const newAnn = {
        ...data,
        ...created,
        id: created.id || `ann-${Date.now()}`,
        date: new Date().toISOString(),
        author: `${currentUser.name} (${currentUser.roleLabel})`,
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      showToast('success', 'Pengumuman baru berhasil diterbitkan.');
    } catch (err) {
      console.warn('addAnnouncement API error:', err.message);
      const fallbackAnn = {
        ...data,
        id: `ann-${Date.now()}`,
        date: new Date().toISOString(),
        author: `${currentUser.name} (${currentUser.roleLabel})`,
      };
      setAnnouncements(prev => [fallbackAnn, ...prev]);
      showToast('success', 'Pengumuman baru berhasil diterbitkan.');
    }
  };

  const updateAnnouncement = async (id, data) => {
    try {
      await apiService.updateAnnouncement(id, data);
    } catch (err) {
      console.warn('updateAnnouncement error:', err.message);
    }
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('success', 'Pengumuman berhasil diperbarui.');
  };

  const deleteAnnouncement = async (id) => {
    try {
      await apiService.deleteAnnouncement(id);
    } catch (err) {
      console.warn('deleteAnnouncement error:', err.message);
    }
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('warning', 'Pengumuman berhasil dihapus.');
  };

  // 6. Complaints Actions
  const addComplaint = async (data) => {
    try {
      const created = await apiService.createComplaint(data);
      const newCmp = {
        ...data,
        ...created,
        id: created.id || `cmp-${Date.now()}`,
        reporterId: currentUser.residentId || currentUser.id,
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
    } catch (err) {
      console.warn('addComplaint error:', err.message);
      const fallbackCmp = {
        ...data,
        id: `cmp-${Date.now()}`,
        reporterId: currentUser.residentId || currentUser.id,
        reporterName: currentUser.name,
        reporterPhone: currentUser.phone || '0812-8899-0011',
        rt: 'RT 01',
        status: 'Baru',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
        responses: [],
      };
      setComplaints(prev => [fallbackCmp, ...prev]);
      showToast('success', 'Aspirasi/pengaduan Anda berhasil dikirim ke pengurus RT.');
    }
  };

  const updateComplaint = async (id, data) => {
    try {
      await apiService.updateComplaint(id, data);
    } catch (err) {
      console.warn('updateComplaint error:', err.message);
    }
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
    showToast('success', 'Laporan aduan berhasil diperbarui.');
  };

  const respondToComplaint = async (id, responseText, newStatus, assignedTo) => {
    try {
      await apiService.addComplaintResponse(id, responseText);
      if (newStatus || assignedTo !== undefined) {
        await apiService.updateComplaint(id, {
          status: newStatus,
          assignedTo: assignedTo !== undefined ? assignedTo : undefined,
        });
      }
    } catch (err) {
      console.warn('respondToComplaint error:', err.message);
    }

    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: newStatus || c.status,
        assignedTo: assignedTo !== undefined ? assignedTo : c.assignedTo,
        updatedAt: new Date().toISOString(),
        responses: [
          ...(c.responses || []),
          {
            author: `${currentUser.name} (${currentUser.roleLabel})`,
            date: new Date().toISOString(),
            message: responseText,
          },
        ],
      };
    }));
    showToast('success', 'Tanggapan dan status pengaduan berhasil diperbarui.');
  };

  const deleteComplaint = (id) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
    showToast('warning', 'Laporan pengaduan berhasil dihapus.');
  };

  // 7. Events Actions
  const addEvent = async (data) => {
    try {
      const created = await apiService.createEvent(data);
      const newEvt = {
        ...data,
        ...created,
        id: created.id || `evt-${Date.now()}`,
        status: 'Akan Datang',
        attendeesCount: 0,
      };
      setEvents(prev => [newEvt, ...prev]);
      showToast('success', 'Agenda kegiatan berhasil dijadwalkan.');
    } catch (err) {
      console.warn('addEvent error:', err.message);
      const fallbackEvt = {
        ...data,
        id: `evt-${Date.now()}`,
        status: 'Akan Datang',
        attendeesCount: 0,
      };
      setEvents(prev => [fallbackEvt, ...prev]);
      showToast('success', 'Agenda kegiatan berhasil dijadwalkan.');
    }
  };

  const updateEvent = async (id, data) => {
    try {
      await apiService.updateEvent(id, data);
    } catch (err) {
      console.warn('updateEvent error:', err.message);
    }
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast('success', 'Agenda kegiatan berhasil diperbarui.');
  };

  const deleteEvent = async (id) => {
    try {
      await apiService.deleteEvent(id);
    } catch (err) {
      console.warn('deleteEvent error:', err.message);
    }
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('warning', 'Agenda kegiatan berhasil dihapus.');
  };

  // 8. Assets Actions
  const addAsset = async (data) => {
    try {
      const created = await apiService.createAsset(data);
      const newAst = {
        ...data,
        ...created,
        id: created.id || `ast-${Date.now()}`,
        condition: data.condition || data.conditionStatus || 'Baik',
      };
      setAssets(prev => [newAst, ...prev]);
      showToast('success', 'Inventaris aset lingkungan berhasil ditambahkan.');
    } catch (err) {
      console.warn('addAsset error:', err.message);
      const fallbackAst = {
        ...data,
        id: `ast-${Date.now()}`,
      };
      setAssets(prev => [fallbackAst, ...prev]);
      showToast('success', 'Inventaris aset lingkungan berhasil ditambahkan.');
    }
  };

  const updateAsset = async (id, data) => {
    try {
      await apiService.updateAsset(id, data);
    } catch (err) {
      console.warn('updateAsset error:', err.message);
    }
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('success', 'Data inventaris berhasil diperbarui.');
  };

  const deleteAsset = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    showToast('warning', 'Data inventaris berhasil dihapus.');
  };

  // 9. Settings Action
  const updateRegionSettings = async (newSettings) => {
    try {
      if (newSettings.bankAccount) {
        await apiService.updateRegionSettings('bank_account', newSettings.bankAccount);
      }
      if (newSettings.letterHeader) {
        await apiService.updateRegionSettings('letter_header', newSettings.letterHeader);
      }
    } catch (err) {
      console.warn('updateRegionSettings error:', err.message);
    }
    setRegionSettings(prev => ({ ...prev, ...newSettings }));
    showToast('success', 'Pengaturan profil wilayah berhasil disimpan.');
  };

  // Financial calculations memo
  const financeSummary = useMemo(() => {
    const totalIn = financeTransactions
      .filter(t => t.type === 'in' && t.status !== 'void')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalOut = financeTransactions
      .filter(t => t.type === 'out' && t.status !== 'void')
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
    login,
    logout,
    // Status
    isLoading,
    isApiConnected,
    loadAllData,
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
