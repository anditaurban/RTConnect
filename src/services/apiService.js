/**
 * REST API Service Layer for RTConnect
 * Fully implements contracts defined in docs/ENDPOINT-USAGE-MAP.md and docs/API-SPEC.md
 * Communicates with the live Railway REST API.
 */

import { apiClient, tokenStorage } from './apiClient';

export const apiService = {
  // ==========================================
  // 1. Auth & Session
  // ==========================================
  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.token) {
      tokenStorage.setToken(res.data.token);
    }
    if (res.data?.refreshToken) {
      tokenStorage.setRefreshToken(res.data.refreshToken);
    }
    return res.data;
  },

  async logout() {
    tokenStorage.clear();
    return { success: true };
  },

  async getMe() {
    const res = await apiClient.get('/me');
    return res.data;
  },

  // ==========================================
  // 2. Dashboard
  // ==========================================
  async getDashboardSummary(rtId = null) {
    const params = rtId ? { rt_id: rtId } : {};
    const res = await apiClient.get('/dashboard/summary', params);
    return res.data;
  },

  // ==========================================
  // 3. Residents (Kependudukan)
  // ==========================================
  async getResidents(params = {}) {
    const res = await apiClient.get('/residents', params);
    return res.data?.items ? res.data.items : (Array.isArray(res.data) ? res.data : []);
  },

  async getResidentById(id) {
    const res = await apiClient.get(`/residents/${id}`);
    return res.data;
  },

  async createResident(data) {
    const payload = {
      nik: data.nik,
      noKK: data.noKK || '3171012309870001',
      name: data.name,
      gender: data.gender || 'Laki-laki',
      birthPlace: data.birthPlace || 'Jakarta',
      birthDate: data.birthDate || '1990-01-01',
      religion: data.religion || 'Islam',
      job: data.job || 'Wiraswasta',
      maritalStatus: data.maritalStatus || 'Kawin',
      familyRole: data.familyRole || 'Kepala Keluarga',
      statusDomisili: data.statusDomisili || 'Tetap',
      statusKependudukan: data.statusKependudukan || 'Aktif',
      phone: data.phone || '-',
      address: data.address || 'Jl. Melati RT 01 RW 05',
    };
    const res = await apiClient.post('/residents', payload);
    return res.data;
  },

  async updateResident(id, data) {
    const res = await apiClient.patch(`/residents/${id}`, data);
    return res.data;
  },

  // ==========================================
  // 4. Families (Kartu Keluarga)
  // ==========================================
  async getFamilies(params = {}) {
    const res = await apiClient.get('/families', params);
    return res.data?.items ? res.data.items : (Array.isArray(res.data) ? res.data : []);
  },

  async getFamilyById(id) {
    const res = await apiClient.get(`/families/${id}`);
    return res.data;
  },

  async createFamily(data) {
    const res = await apiClient.post('/families', data);
    return res.data;
  },

  async updateFamily(id, data) {
    const res = await apiClient.patch(`/families/${id}`, data);
    return res.data;
  },

  // ==========================================
  // 5. Letters (Layanan Surat)
  // ==========================================
  async getLetterTypes() {
    const res = await apiClient.get('/letters/types');
    return res.data?.items ? res.data.items : [];
  },

  async getLetterRequests(params = {}) {
    const res = await apiClient.get('/letters/requests', params);
    return res.data?.items ? res.data.items : [];
  },

  async getLetterRequestById(id) {
    const res = await apiClient.get(`/letters/requests/${id}`);
    return res.data;
  },

  async createLetterRequest(data) {
    const payload = {
      letterTypeId: data.letterTypeId,
      purpose: data.purpose || 'Keperluan administrasi warga',
    };
    const res = await apiClient.post('/letters/requests', payload);
    return res.data;
  },

  async updateLetterRequest(id, data) {
    const res = await apiClient.patch(`/letters/requests/${id}`, data);
    return res.data;
  },

  async submitLetterRequest(id) {
    const res = await apiClient.post(`/letters/requests/${id}/submit`);
    return res.data;
  },

  async reviewLetterRequest(id, actionOrStatus, notes, letterNumber = null) {
    let action = actionOrStatus;
    if (actionOrStatus === 'Diproses') action = 'process';
    else if (actionOrStatus === 'Perlu Revisi') action = 'revise';
    else if (actionOrStatus === 'Disetujui') action = 'approve';
    else if (actionOrStatus === 'Ditolak') action = 'reject';
    else if (actionOrStatus === 'Selesai') action = 'complete';

    const payload = { action, notes: notes || 'Verifikasi oleh pengurus.' };
    if (letterNumber) payload.letterNumber = letterNumber;
    const res = await apiClient.post(`/letters/requests/${id}/review`, payload);
    return res.data;
  },

  async getLetterDocument(id) {
    const res = await apiClient.get(`/letters/requests/${id}/document`);
    return res.data;
  },

  // ==========================================
  // 6. Finance (Buku Kas & Transaksi)
  // ==========================================
  async getFinanceSummary(rtId = null) {
    const params = rtId ? { rt_id: rtId } : {};
    const res = await apiClient.get('/finance/summary', params);
    return res.data;
  },

  async getFinanceTransactions(params = {}) {
    const res = await apiClient.get('/finance/transactions', params);
    return res.data?.items ? res.data.items : [];
  },

  async createFinanceTransaction(data) {
    const res = await apiClient.post('/finance/transactions', data);
    return res.data;
  },

  async updateFinanceTransaction(id, data) {
    const res = await apiClient.patch(`/finance/transactions/${id}`, data);
    return res.data;
  },

  async voidFinanceTransaction(id, voidReason) {
    const res = await apiClient.patch(`/finance/transactions/${id}`, {
      action: 'void',
      voidReason: voidReason || 'Dibatalkan oleh pengurus kas',
    });
    return res.data;
  },

  // ==========================================
  // 7. Dues (Iuran & Tagihan Lingkungan)
  // ==========================================
  async getDuesTypes() {
    const res = await apiClient.get('/dues/types');
    return res.data?.items ? res.data.items : [];
  },

  async createDuesType(data) {
    const res = await apiClient.post('/dues/types', data);
    return res.data;
  },

  async getDuesBills(params = {}) {
    const res = await apiClient.get('/dues/bills', params);
    return res.data?.items ? res.data.items : [];
  },

  async getMyBills() {
    const res = await apiClient.get('/dues/my-bills');
    return res.data?.items ? res.data.items : [];
  },

  async getDuesBillById(id) {
    const res = await apiClient.get(`/dues/bills/${id}`);
    return res.data;
  },

  async generateDuesBills(data) {
    const res = await apiClient.post('/dues/bills/generate', data);
    return res.data;
  },

  async payDuesBill(billId, paymentMethod, paymentProofUrl) {
    const res = await apiClient.post(`/dues/payments/${billId}`, {
      paymentMethod,
      paymentProofUrl,
    });
    return res.data;
  },

  async verifyDuesBill(billId, isApproved, notes) {
    const res = await apiClient.post(`/dues/payments/${billId}/verify`, {
      action: isApproved ? 'approve' : 'reject',
      notes,
    });
    return res.data;
  },

  // ==========================================
  // 8. Announcements (Warta & Pengumuman)
  // ==========================================
  async getAnnouncements(params = {}) {
    const res = await apiClient.get('/announcements', params);
    return res.data?.items ? res.data.items : [];
  },

  async createAnnouncement(data) {
    const res = await apiClient.post('/announcements', data);
    return res.data;
  },

  async updateAnnouncement(id, data) {
    const res = await apiClient.patch(`/announcements/${id}`, data);
    return res.data;
  },

  async deleteAnnouncement(id) {
    const res = await apiClient.delete(`/announcements/${id}`);
    return res.data;
  },

  // ==========================================
  // 9. Events (Agenda Kegiatan)
  // ==========================================
  async getEvents(params = {}) {
    const res = await apiClient.get('/events', params);
    return res.data?.items ? res.data.items : [];
  },

  async createEvent(data) {
    const res = await apiClient.post('/events', data);
    return res.data;
  },

  async updateEvent(id, data) {
    const res = await apiClient.patch(`/events/${id}`, data);
    return res.data;
  },

  async deleteEvent(id) {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  },

  // ==========================================
  // 10. Complaints (Aspirasi & Pengaduan)
  // ==========================================
  async getComplaints(params = {}) {
    const res = await apiClient.get('/complaints', params);
    return res.data?.items ? res.data.items : [];
  },

  async getComplaintById(id) {
    const res = await apiClient.get(`/complaints/${id}`);
    return res.data;
  },

  async createComplaint(data) {
    const res = await apiClient.post('/complaints', data);
    return res.data;
  },

  async updateComplaint(id, data) {
    const res = await apiClient.patch(`/complaints/${id}`, data);
    return res.data;
  },

  async addComplaintResponse(id, message) {
    const res = await apiClient.post(`/complaints/${id}/responses`, { message });
    return res.data;
  },

  // ==========================================
  // 11. Assets (Inventaris Lingkungan)
  // ==========================================
  async getAssets(params = {}) {
    const res = await apiClient.get('/assets', params);
    return res.data?.items ? res.data.items : [];
  },

  async createAsset(data) {
    const payload = {
      code: data.code,
      name: data.name,
      category: data.category,
      quantity: Number(data.quantity) || 1,
      unit: data.unit || 'Unit',
      conditionStatus: data.conditionStatus || data.condition || 'Baik',
      location: data.location,
      pic: data.pic,
      notes: data.notes || '',
    };
    const res = await apiClient.post('/assets', payload);
    return res.data;
  },

  async updateAsset(id, data) {
    const payload = { ...data };
    if (data.condition && !data.conditionStatus) {
      payload.conditionStatus = data.condition;
    }
    const res = await apiClient.patch(`/assets/${id}`, payload);
    return res.data;
  },

  // ==========================================
  // 12. Settings (Pengaturan Profil Wilayah)
  // ==========================================
  async getRegionSettings() {
    const res = await apiClient.get('/settings/region');
    return res.data;
  },

  async updateRegionSettings(key, value) {
    const res = await apiClient.patch('/settings/region', { key, value });
    return res.data;
  },

  // ==========================================
  // 13. Notifications
  // ==========================================
  async getNotifications() {
    const res = await apiClient.get('/notifications');
    return res.data?.items ? res.data.items : [];
  },
};
