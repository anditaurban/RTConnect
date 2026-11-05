import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { tokenStorage } from '../services/apiClient';

const AppContext = createContext(null);

const ROLE_LABELS = {
  warga: 'Warga RT 01',
  ketua_rt: 'Ketua RT 01',
  ketua_rw: 'Ketua RW 05',
  sekretaris: 'Sekretaris RT 01',
  bendahara: 'Bendahara RT 01',
  petugas: 'Petugas Lingkungan',
  super_admin: 'Super Admin',
};

const DEFAULT_REGION_SETTINGS = {
  rwName: 'Rukun Warga 05',
  subdistrict: 'Kelurahan Kebon Jeruk',
  district: 'Kecamatan Kebon Jeruk',
  city: 'Kota Administrasi Jakarta Barat',
  province: 'DKI Jakarta',
  postalCode: '11530',
  contactCenter: '0812-9876-5432',
  bankAccount: {
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '8820-1928-33',
    accountHolder: 'KAS RT 01 RW 05',
  },
  letterHeader: {
    government: 'PEMERINTAH KOTA ADMINISTRASI JAKARTA BARAT',
    district: 'KECAMATAN KEBON JERUK — KELURAHAN KEBON JERUK',
    neighborhood: 'RUKUN WARGA 05 / RUKUN TETANGGA 01',
    address: 'Sekretariat: Jl. Mawar Indah Blok B1 No. 01, Telp: 0813-1122-3344',
  },
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

  // Auth & Session state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Loading & connection status
  const [isLoading, setIsLoading] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(true);

  // Live domain collections — 100% sourced from REST API
  const [residents, setResidents] = useState([]);
  const [families, setFamilies] = useState([]);
  const [letterRequests, setLetterRequests] = useState([]);
  const [letterTypes, setLetterTypes] = useState([]);
  const [financeTransactions, setFinanceTransactions] = useState([]);
  const [duesBills, setDuesBills] = useState([]);
  const [duesTypes, setDuesTypes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [events, setEvents] = useState([]);
  const [assets, setAssets] = useState([]);
  const [regionSettings, setRegionSettings] = useState(DEFAULT_REGION_SETTINGS);

  // Global toast notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const activeRole = currentUser?.role || 'warga';

  // Format user object from API to ensure required UI fields
  const formatApiUser = (user) => {
    if (!user) return null;
    return {
      ...user,
      role: user.role || 'warga',
      roleLabel: user.roleLabel || ROLE_LABELS[user.role] || 'Warga RT 01',
      avatar: user.avatarUrl || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      region: user.regionName || user.region || 'RT 01 / RW 05',
    };
  };

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

      if (resRes.status === 'fulfilled' && Array.isArray(resRes.value)) {
        setResidents(resRes.value);
      }
      if (famRes.status === 'fulfilled' && Array.isArray(famRes.value)) {
        setFamilies(famRes.value);
      }
      if (lTypeRes.status === 'fulfilled' && Array.isArray(lTypeRes.value)) {
        setLetterTypes(lTypeRes.value);
      }
      if (lReqRes.status === 'fulfilled' && Array.isArray(lReqRes.value)) {
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
      if (duesTypeRes.status === 'fulfilled' && Array.isArray(duesTypeRes.value)) {
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
      console.warn('Gagal memuat data dari REST API:', err);
      setIsApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth session on startup using stored token
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenStorage.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const me = await apiService.getMe();
        if (me) {
          const user = formatApiUser(me);
          setCurrentUser(user);
          setIsAuthenticated(true);
          await loadAllData();
        } else {
          tokenStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (err) {
        tokenStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [loadAllData]);

  // Real API Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const loginData = await apiService.login(email, password);
      const user = formatApiUser(loginData.user);
      setCurrentUser(user);
      setIsAuthenticated(true);
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

  // Real API Logout
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // ignore
    }
    tokenStorage.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setResidents([]);
    setFamilies([]);
    setLetterRequests([]);
    setFinanceTransactions([]);
    setDuesBills([]);
    setAnnouncements([]);
    setComplaints([]);
    setEvents([]);
    setAssets([]);
    showToast('info', 'Anda telah keluar dari aplikasi RTConnect.');
  };

  // Backward compatibility alias for any remaining callers
  const switchRole = (roleKey) => {
    console.info(`Peralihan role sekarang dilakukan via login akun resmi (${roleKey}).`);
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
      showToast('error', err.message || 'Gagal menambahkan data warga.');
      throw err;
    }
  };

  const updateResident = async (id, data) => {
    try {
      await apiService.updateResident(id, data);
      setResidents(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
      showToast('success', 'Data warga berhasil diperbarui.');
    } catch (err) {
      console.error('updateResident error:', err);
      showToast('error', err.message || 'Gagal memperbarui data warga.');
      throw err;
    }
  };

  const deleteResident = (id) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    showToast('warning', 'Data warga berhasil dihapus.');
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
        residentId: currentUser?.residentId || created.residentId || 'res-01',
        residentName: currentUser?.name || 'Warga',
        nik: currentUser?.nik || '3171011508890002',
        noKK: currentUser?.noKK || '3171012309870001',
        rt: 'RT 01',
        rw: 'RW 05',
        purpose: requestData.purpose,
        referenceNo: created.reference_no || created.referenceNo || `REQ/${Date.now()}`,
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
      showToast('error', err.message || 'Gagal mengirim permohonan surat.');
      throw err;
    }
  };

  const updateLetterRequest = async (id, data) => {
    try {
      await apiService.updateLetterRequest(id, data);
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
    } catch (err) {
      console.warn('updateLetterRequest error:', err.message);
      showToast('error', err.message || 'Gagal memperbarui permohonan surat.');
    }
  };

  const reviewLetterRequest = async (id, newStatus, notes, letterNumber = null) => {
    try {
      await apiService.reviewLetterRequest(id, newStatus, notes, letterNumber);
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
          reviewedBy: currentUser?.name || 'Pengurus',
          approvedBy: newStatus === 'Disetujui' ? (currentUser?.name || 'Ketua RT') : req.approvedBy,
          timeline: [
            ...(req.timeline || []),
            {
              status: newStatus,
              date: new Date().toISOString(),
              note: notes || `Status diubah menjadi ${newStatus} oleh ${currentUser?.name || 'Pengurus'}.`,
            },
          ],
        };
      }));
      showToast('success', `Status pengajuan surat berhasil diperbarui menjadi "${newStatus}".`);
    } catch (err) {
      console.warn('reviewLetterRequest error:', err.message);
      showToast('error', err.message || 'Gagal memverifikasi pengajuan surat.');
    }
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
        recordedBy: `${currentUser?.name} (${currentUser?.roleLabel})`,
        rt: 'RT 01',
        rw: 'RW 05',
      };
      setFinanceTransactions(prev => [newTx, ...prev]);
      showToast('success', `Transaksi kas ${data.type === 'in' ? 'masuk' : 'keluar'} berhasil dicatat.`);
    } catch (err) {
      console.error('addFinanceTransaction error:', err);
      showToast('error', err.message || 'Gagal mencatat transaksi kas.');
    }
  };

  const updateFinanceTransaction = async (id, data) => {
    try {
      await apiService.updateFinanceTransaction(id, data);
      setFinanceTransactions(prev => prev.map(t => {
        if (t.id !== id) return t;
        return {
          ...t,
          ...data,
          auditNote: `${data.auditNote || 'Koreksi transaksi'} (diubah oleh ${currentUser?.name})`,
        };
      }));
      showToast('success', 'Data transaksi kas berhasil diperbarui.');
    } catch (err) {
      console.warn('updateFinanceTransaction error:', err.message);
      showToast('error', err.message || 'Gagal memperbarui transaksi.');
    }
  };

  const voidFinanceTransaction = async (id, reason) => {
    try {
      await apiService.voidFinanceTransaction(id, reason);
      setFinanceTransactions(prev => prev.map(t => {
        if (t.id !== id) return t;
        return {
          ...t,
          status: 'void',
          category: `[BATAL/VOID] ${t.category}`,
          amount: 0,
          auditNote: `Dibatalkan oleh ${currentUser?.name}. Alasan: ${reason}`,
        };
      }));
      showToast('warning', 'Transaksi kas berhasil dibatalkan (void) dengan catatan audit.');
    } catch (err) {
      console.warn('voidFinanceTransaction error:', err.message);
      showToast('error', err.message || 'Gagal membatalkan transaksi.');
    }
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
      showToast('error', err.message || 'Gagal menambahkan jenis iuran.');
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
    } catch (err) {
      console.warn('payDuesBill error:', err.message);
      showToast('error', err.message || 'Gagal mengirim pembayaran.');
    }
  };

  const verifyDuesBill = async (billId, isApproved, notes) => {
    try {
      await apiService.verifyDuesBill(billId, isApproved, notes);
      if (isApproved) {
        apiService.getFinanceTransactions().then(txs => {
          if (Array.isArray(txs)) setFinanceTransactions(txs);
        }).catch(() => {});
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
            auditNote: `Diverifikasi oleh ${currentUser?.name}`,
          });
        }

        return {
          ...b,
          status: newStatus,
          verificationNotes: notes || (isApproved ? 'Pembayaran telah diverifikasi sah.' : 'Bukti pembayaran ditolak. Silakan unggah bukti yang sesuai.'),
        };
      }));
      showToast(isApproved ? 'success' : 'warning', isApproved ? 'Pembayaran berhasil diverifikasi lunas.' : 'Pembayaran ditolak.');
    } catch (err) {
      console.warn('verifyDuesBill error:', err.message);
      showToast('error', err.message || 'Gagal memverifikasi tagihan.');
    }
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
        author: `${currentUser?.name} (${currentUser?.roleLabel})`,
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      showToast('success', 'Pengumuman baru berhasil diterbitkan.');
    } catch (err) {
      console.warn('addAnnouncement error:', err.message);
      showToast('error', err.message || 'Gagal menerbitkan pengumuman.');
    }
  };

  const updateAnnouncement = async (id, data) => {
    try {
      await apiService.updateAnnouncement(id, data);
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      showToast('success', 'Pengumuman berhasil diperbarui.');
    } catch (err) {
      console.warn('updateAnnouncement error:', err.message);
      showToast('error', err.message || 'Gagal memperbarui pengumuman.');
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await apiService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      showToast('warning', 'Pengumuman berhasil dihapus.');
    } catch (err) {
      console.warn('deleteAnnouncement error:', err.message);
      showToast('error', err.message || 'Gagal menghapus pengumuman.');
    }
  };

  // 6. Complaints Actions
  const addComplaint = async (data) => {
    try {
      const created = await apiService.createComplaint(data);
      const newCmp = {
        ...data,
        ...created,
        id: created.id || `cmp-${Date.now()}`,
        reporterId: currentUser?.residentId || currentUser?.id,
        reporterName: currentUser?.name,
        reporterPhone: currentUser?.phone || '0812-8899-0011',
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
      showToast('error', err.message || 'Gagal mengirim pengaduan.');
    }
  };

  const updateComplaint = async (id, data) => {
    try {
      await apiService.updateComplaint(id, data);
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
      showToast('success', 'Laporan aduan berhasil diperbarui.');
    } catch (err) {
      console.warn('updateComplaint error:', err.message);
      showToast('error', err.message || 'Gagal memperbarui aduan.');
    }
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
              author: `${currentUser?.name} (${currentUser?.roleLabel})`,
              date: new Date().toISOString(),
              message: responseText,
            },
          ],
        };
      }));
      showToast('success', 'Tanggapan dan status pengaduan berhasil diperbarui.');
    } catch (err) {
      console.warn('respondToComplaint error:', err.message);
      showToast('error', err.message || 'Gagal menanggapi pengaduan.');
    }
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
      showToast('error', err.message || 'Gagal menjadwalkan kegiatan.');
    }
  };

  const updateEvent = async (id, data) => {
    try {
      await apiService.updateEvent(id, data);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
      showToast('success', 'Agenda kegiatan berhasil diperbarui.');
    } catch (err) {
      console.warn('updateEvent error:', err.message);
      showToast('error', err.message || 'Gagal memperbarui kegiatan.');
    }
  };

  const deleteEvent = async (id) => {
    try {
      await apiService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      showToast('warning', 'Agenda kegiatan berhasil dihapus.');
    } catch (err) {
      console.warn('deleteEvent error:', err.message);
      showToast('error', err.message || 'Gagal menghapus kegiatan.');
    }
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
      showToast('error', err.message || 'Gagal menambahkan aset.');
    }
  };

  const updateAsset = async (id, data) => {
    try {
      await apiService.updateAsset(id, data);
      setAssets(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      showToast('success', 'Data inventaris berhasil diperbarui.');
    } catch (err) {
      console.warn('updateAsset error:', err.message);
      showToast('error', err.message || 'Gagal memperbarui aset.');
    }
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
      setRegionSettings(prev => ({ ...prev, ...newSettings }));
      showToast('success', 'Pengaturan profil wilayah berhasil disimpan.');
    } catch (err) {
      console.warn('updateRegionSettings error:', err.message);
      showToast('error', err.message || 'Gagal menyimpan pengaturan wilayah.');
    }
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
    isAuthenticated,
    isCheckingAuth,
    login,
    logout,
    switchRole,
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
