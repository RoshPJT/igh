// Centralized API Service for BIT Mesra Guest House

const API_BASE = '/api';

export const api = {
  // Rooms
  async getRooms(checkIn = '', checkOut = '') {
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_BASE}/rooms${queryString}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch rooms: ${res.statusText}`);
    }
    return await res.json();
  },

  async toggleMaintenance(roomNumber) {
    const res = await fetch(`${API_BASE}/rooms/${roomNumber}/maintenance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to toggle maintenance for room ${roomNumber}`);
    }
    return await res.json();
  },

  // Bookings
  async getBookings(status = '') {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE}/bookings${query}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch bookings: ${res.statusText}`);
    }
    return await res.json();
  },

  async getBookingById(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Booking ${id} not found`);
    }
    return await res.json();
  },

  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit booking request');
    }
    return data;
  },

  async approveBooking(id, approvalNotes = '') {
    const res = await fetch(`${API_BASE}/bookings/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalNotes }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to approve booking');
    }
    return data;
  },

  async rejectBooking(id, rejectionReason = '') {
    const res = await fetch(`${API_BASE}/bookings/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejectionReason }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to reject booking');
    }
    return data;
  },

  async cancelBooking(id, reason = '') {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to cancel booking');
    }
    return data;
  },

  async modifyBooking(id, modifyData) {
    const res = await fetch(`${API_BASE}/bookings/${id}/modify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modifyData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to modify booking');
    }
    return data;
  },

  async payBooking(id, paymentMethod = 'Mock Gateway', transactionId = '') {
    const res = await fetch(`${API_BASE}/bookings/${id}/pay`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod, transactionId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to process payment');
    }
    return data;
  },

  // Complaints
  async getComplaints(status = '') {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE}/complaints${query}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch complaints: ${res.statusText}`);
    }
    return await res.json();
  },

  async getComplaintById(id) {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Complaint ${id} not found`);
    }
    return await res.json();
  },

  async createComplaint(complaintData) {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit complaint');
    }
    return data;
  },

  async updateComplaintStatus(id, status, adminNotes = '') {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update complaint status');
    }
    return data;
  },

  // AI Conversational Agent
  async sendChatMessage(message, sessionId = 'default_session', conversationHistory = [], userProfile = null) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, conversationHistory, userProfile }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to communicate with AI Assistant');
    }
    return data;
  },
};
