/**
 * API Service Adapter Layer for RTConnect
 * This file serves as the abstraction contract defined in docs/API-SPEC.md
 * Currently resolves using in-memory mock data.
 * In Phase 4, this adapter will be updated to make real fetch/axios calls to /api/v1.
 */

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

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  // 1. Auth & Me
  async login(email, password) {
    await delay();
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('Email atau kata sandi tidak sesuai.');
    }
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-xyz',
        user,
      },
    };
  },

  async getMe(userId) {
    await delay();
    const user = MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0];
    return { success: true, data: user };
  },

  // 2. Dashboard
  async getDashboardSummary(role, rt) {
    await delay();
    return {
      success: true,
      data: {
        totalWarga: 176,
        totalKK: 48,
        kasSaldo: 3680000,
        suratTertunda: 2,
        aspirasiAktif: 2,
        tagihanMenunggu: 1,
      },
    };
  },

  // 3. Residents & Families
  async getResidents(params = {}) {
    await delay();
    let items = [...MOCK_RESIDENTS];
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(r => r.name.toLowerCase().includes(q) || r.nik.includes(q) || r.noKK.includes(q));
    }
    if (params.status) {
      items = items.filter(r => r.statusKependudukan === params.status);
    }
    if (params.rt) {
      items = items.filter(r => r.rt === params.rt);
    }
    return {
      success: true,
      data: {
        items,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: items.length,
          totalPages: 1,
        },
      },
    };
  },

  async getFamilies() {
    await delay();
    return { success: true, data: { items: MOCK_FAMILIES } };
  },

  // 4. Letters
  async getLetterTypes() {
    await delay();
    return { success: true, data: { items: MOCK_LETTER_TYPES } };
  },

  async getLetterRequests(residentId = null) {
    await delay();
    let items = [...MOCK_LETTER_REQUESTS];
    if (residentId) {
      items = items.filter(r => r.residentId === residentId);
    }
    return { success: true, data: { items } };
  },

  // 5. Finance & Dues
  async getFinanceSummary() {
    await delay();
    return {
      success: true,
      data: {
        saldo: 3680000,
        kasMasukBulanIni: 4750000,
        kasKeluarBulanIni: 1620000,
      },
    };
  },

  async getTransactions() {
    await delay();
    return { success: true, data: { items: MOCK_FINANCE_TRANSACTIONS } };
  },

  async getDuesBills(residentId = null) {
    await delay();
    let items = [...MOCK_DUES_BILLS];
    if (residentId) {
      items = items.filter(b => b.residentId === residentId);
    }
    return { success: true, data: { items } };
  },

  // 6. Announcements, Complaints, Events, Assets
  async getAnnouncements() {
    await delay();
    return { success: true, data: { items: MOCK_ANNOUNCEMENTS } };
  },

  async getComplaints(residentId = null) {
    await delay();
    let items = [...MOCK_COMPLAINTS];
    if (residentId) {
      items = items.filter(c => c.reporterId === residentId);
    }
    return { success: true, data: { items } };
  },

  async getEvents() {
    await delay();
    return { success: true, data: { items: MOCK_EVENTS } };
  },

  async getAssets() {
    await delay();
    return { success: true, data: { items: MOCK_ASSETS } };
  },

  async getRegionSettings() {
    await delay();
    return { success: true, data: MOCK_REGION_SETTINGS };
  },
};

