import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Wrench,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Search,
  MessageSquare,
  Bed,
  Check,
  ChevronRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import bitLogo from '../assets/bit_mesra_logo.png';

export default function WardenDashboard({
  rooms,
  bookings,
  onRefreshData,
  onRoomsUpdated,
  onBookingApproved,
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'all', 'maintenance'
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Approval modal state
  const [selectedBookingForApprove, setSelectedBookingForApprove] = useState(null);
  const [approvalNote, setApprovalNote] = useState('Credentials verified. Approved by Registrar.');

  // Rejection modal state
  const [selectedBookingForReject, setSelectedBookingForReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Institutional priority / hostel quota constraint.');

  // Filter bookings
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING_APPROVAL');
  const approvedBookings = bookings.filter((b) => b.status === 'APPROVED');
  const paidBookings = bookings.filter((b) => b.status === 'PAID');
  const maintenanceRooms = rooms.filter((r) => r.isMaintenance);

  const displayedBookings = bookings.filter((b) => {
    if (activeTab === 'pending') return b.status === 'PENDING_APPROVAL';
    if (activeTab === 'approved') return b.status === 'APPROVED';
    if (activeTab === 'paid') return b.status === 'PAID';
    return true; // 'all'
  }).filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingId?.toLowerCase().includes(q) ||
      b.guestDetails?.name?.toLowerCase().includes(q) ||
      b.guestType?.toLowerCase().includes(q) ||
      b.roomNumber?.toString().includes(q)
    );
  });

  // Action: Approve
  const handleConfirmApprove = async () => {
    if (!selectedBookingForApprove) return;
    try {
      setIsProcessing(true);
      await api.approveBooking(selectedBookingForApprove.bookingId, approvalNote);
      setFeedbackMsg({
        type: 'success',
        text: `Booking ${selectedBookingForApprove.bookingId} approved. Guest can now proceed to payment!`,
      });
      if (onBookingApproved) {
        onBookingApproved(selectedBookingForApprove);
      }
      setSelectedBookingForApprove(null);
      setIsProcessing(false);
      onRefreshData();
    } catch (err) {
      setIsProcessing(false);
      setFeedbackMsg({ type: 'error', text: err.message || 'Error approving booking' });
    }
  };

  // Action: Reject
  const handleConfirmReject = async () => {
    if (!selectedBookingForReject) return;
    try {
      setIsProcessing(true);
      await api.rejectBooking(selectedBookingForReject.bookingId, rejectionReason);
      setFeedbackMsg({
        type: 'success',
        text: `Booking ${selectedBookingForReject.bookingId} rejected and room freed.`,
      });
      setSelectedBookingForReject(null);
      setIsProcessing(false);
      onRefreshData();
    } catch (err) {
      setIsProcessing(false);
      setFeedbackMsg({ type: 'error', text: err.message || 'Error rejecting booking' });
    }
  };

  // Action: Toggle Maintenance
  const handleToggleMaintenance = async (roomNumber) => {
    try {
      setIsProcessing(true);
      const res = await api.toggleMaintenance(roomNumber);
      setIsProcessing(false);
      setFeedbackMsg({
        type: 'success',
        text: `Room ${roomNumber} maintenance is now set to: ${res.data.isMaintenance ? 'Under Maintenance' : 'Operational'}`,
      });
      onRefreshData();
    } catch (err) {
      setIsProcessing(false);
      setFeedbackMsg({ type: 'error', text: err.message || 'Error updating room maintenance' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full bg-white p-0.5 flex items-center justify-center shadow-lg border-2 border-amber-400 flex-shrink-0">
              <img
                src={bitLogo}
                alt="BIT Mesra Crest"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-amber-500 text-slate-950 font-bold">
                  <Shield className="w-4 h-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  BIT Mesra Registrar & Admin Management Console
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Institutional verification, booking approvals, room inventory, and maintenance controls.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onRefreshData}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Sync Data</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Pending Approvals
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {pendingBookings.length}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
              Approved (Awaiting Pay)
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {approvedBookings.length}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Paid & Confirmed
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {paidBookings.length}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
              Under Maintenance
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {maintenanceRooms.length} <span className="text-xs text-slate-400">/ 33 rooms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-sm ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-rose-50 text-rose-900 border border-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'pending'
                ? 'bg-bit-maroon text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals ({pendingBookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'all'
                ? 'bg-bit-maroon text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>All Bookings ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'maintenance'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance Floor Map (33 Rooms)</span>
          </button>
        </div>

        {/* Search */}
        {activeTab !== 'maintenance' && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, name, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-bit-maroon w-full sm:w-60"
            />
          </div>
        )}
      </div>

      {/* SECTION 1: MAINTENANCE FLOOR MAP */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                <span>Admin Maintenance Override Map</span>
              </h3>
              <p className="text-xs text-slate-500">
                Click any room to toggle its maintenance status immediately. Rooms under maintenance cannot be selected or booked by guests.
              </p>
            </div>
            <div className="text-xs px-3 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 font-semibold">
              Tip: Click any square to toggle
            </div>
          </div>

          {/* Floor 1 Grid */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-bit-maroon" />
              <span>Floor 1 (Rooms 101 – 117)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5">
              {rooms
                .filter((r) => r.floor === 1)
                .map((room) => {
                  const isMaint = room.isMaintenance;
                  return (
                    <button
                      key={room.roomNumber}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleToggleMaintenance(room.roomNumber)}
                      className={`p-3 rounded-xl border-2 text-center transition flex flex-col items-center justify-center space-y-1 relative ${
                        isMaint
                          ? 'bg-slate-200 border-slate-400 text-slate-700 shadow-inner'
                          : 'bg-emerald-50 border-emerald-400 text-emerald-950 hover:bg-emerald-100'
                      }`}
                    >
                      <span className="text-sm font-extrabold">{room.roomNumber}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          isMaint ? 'bg-slate-500 text-white' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isMaint ? 'Maintenance' : 'Operational'}
                      </span>
                      <span className="text-[8px] text-slate-400">Click to switch</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Floor 2 Grid */}
          <div className="space-y-2 pt-4">
            <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-bit-gold" />
              <span>Floor 2 (Rooms 201 – 216)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {rooms
                .filter((r) => r.floor === 2)
                .map((room) => {
                  const isMaint = room.isMaintenance;
                  return (
                    <button
                      key={room.roomNumber}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleToggleMaintenance(room.roomNumber)}
                      className={`p-3 rounded-xl border-2 text-center transition flex flex-col items-center justify-center space-y-1 relative ${
                        isMaint
                          ? 'bg-slate-200 border-slate-400 text-slate-700 shadow-inner'
                          : 'bg-emerald-50 border-emerald-400 text-emerald-950 hover:bg-emerald-100'
                      }`}
                    >
                      <span className="text-sm font-extrabold">{room.roomNumber}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          isMaint ? 'bg-slate-500 text-white' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isMaint ? 'Maintenance' : 'Operational'}
                      </span>
                      <span className="text-[8px] text-slate-400">Click to switch</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: BOOKINGS TABLE */}
      {activeTab !== 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {displayedBookings.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold">No bookings found in this view.</p>
              <p className="text-xs text-slate-400">All guest house requests have been handled.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Guest & Type</th>
                    <th className="py-3.5 px-4">Verification Details</th>
                    <th className="py-3.5 px-4">Room & Dates</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {displayedBookings.map((b) => {
                    const isPending = b.status === 'PENDING_APPROVAL';
                    const isApproved = b.status === 'APPROVED';
                    const isPaid = b.status === 'PAID';
                    const isRejected = b.status === 'REJECTED';

                    return (
                      <tr key={b.bookingId} className="hover:bg-slate-50/80 transition">
                        {/* Booking ID */}
                        <td className="py-4 px-4 font-mono font-bold text-bit-maroon">
                          {b.bookingId}
                          <div className="text-[10px] text-slate-400 font-normal">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Guest Name & Type */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{b.guestDetails?.name}</div>
                          <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                            {b.guestType}
                          </span>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {b.guestDetails?.phone}
                          </div>
                        </td>

                        {/* Credentials Details */}
                        <td className="py-4 px-4 max-w-xs">
                          {b.guestType === 'Student' && (
                            <div className="space-y-0.5 text-xs">
                              <div><strong>Roll:</strong> {b.guestDetails?.rollNumber}</div>
                              <div className="text-slate-500">{b.guestDetails?.department} • {b.guestDetails?.yearOfStudy}</div>
                            </div>
                          )}

                          {b.guestType === 'Parent' && (
                            <div className="space-y-0.5 text-xs">
                              <div><strong>Student:</strong> {b.guestDetails?.studentName} ({b.guestDetails?.studentRollNumber})</div>
                              <div className="text-slate-500">Rel: {b.guestDetails?.relationship} • {b.guestDetails?.govtIdType}: {b.guestDetails?.govtIdNumber}</div>
                            </div>
                          )}

                          {b.guestType === 'Alumni' && (
                            <div className="space-y-0.5 text-xs">
                              <div><strong>Passout:</strong> {b.guestDetails?.passoutYear} ({b.guestDetails?.branch})</div>
                              <div className="text-slate-500">{b.guestDetails?.govtIdType}: {b.guestDetails?.govtIdNumber}</div>
                            </div>
                          )}

                          {b.guestType === 'Other College Guest' && (
                            <div className="space-y-0.5 text-xs">
                              <div><strong>College:</strong> {b.guestDetails?.homeCollege}</div>
                              <div className="text-slate-500">Sponsor: {b.guestDetails?.sponsoringFaculty}</div>
                              <div className="text-slate-400 text-[10px]">{b.guestDetails?.govtIdType}: {b.guestDetails?.govtIdNumber}</div>
                            </div>
                          )}
                        </td>

                        {/* Room & Dates */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 flex items-center space-x-1">
                            <Bed className="w-3.5 h-3.5 text-bit-maroon" />
                            <span>Room {b.roomNumber}</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            {b.checkIn} → {b.checkOut}
                          </div>
                          <div className="text-[11px] text-slate-400">{b.nights} night(s)</div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-4 font-bold text-slate-900">
                          ₹{b.amount?.toLocaleString('en-IN')}
                          <div className="text-[10px] text-slate-400 font-normal">
                            {b.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              isPending
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : isApproved
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : isPaid
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {b.status}
                          </span>
                          {b.approvalNotes && (
                            <p className="text-[10px] text-slate-500 mt-1 italic">
                              Note: {b.approvalNotes}
                            </p>
                          )}
                          {b.rejectionReason && (
                            <p className="text-[10px] text-rose-600 mt-1 italic">
                              Reason: {b.rejectionReason}
                            </p>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedBookingForApprove(b)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                                title="Approve booking and unlock payment"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedBookingForReject(b)}
                                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                                title="Reject booking request"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No action needed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* APPROVAL MODAL WITH NOTE */}
      {selectedBookingForApprove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">
                Approve Guest Booking ({selectedBookingForApprove.bookingId})
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Approving this reservation certifies that the identity credentials for{' '}
              <strong>{selectedBookingForApprove.guestDetails?.name}</strong> have been confirmed. This will unlock the payment gateway for the guest to finalize their stay in <strong>Room {selectedBookingForApprove.roomNumber}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Approval Note (Visible to Guest)
              </label>
              <textarea
                rows={3}
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-slate-800"
                placeholder="Enter note or instructions for the guest..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForApprove(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmApprove}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center space-x-1.5"
              >
                <span>{isProcessing ? 'Approving...' : 'Confirm Approval'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL WITH REASON */}
      {selectedBookingForReject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">
                Reject Booking ({selectedBookingForReject.bookingId})
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Rejecting will free up <strong>Room {selectedBookingForReject.roomNumber}</strong> on the visual floor map so that other prospective guests can reserve it.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rejection Reason (Visible to Guest)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs text-slate-800"
                placeholder="Specify the reason for rejection..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForReject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center space-x-1.5"
              >
                <span>{isProcessing ? 'Rejecting...' : 'Confirm Rejection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
