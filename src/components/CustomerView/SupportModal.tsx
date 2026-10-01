import React, { useState } from 'react';
import { X, LifeBuoy, Send, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SupportTicket } from '../../types';
import { store, AppState } from '../../services/store';

interface SupportModalProps {
  state: AppState;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ state, onClose }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    state.supportTickets.length > 0 ? state.supportTickets[0].id : null
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Order Issue');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDescription, setNewDescription] = useState('');
  const [replyText, setReplyText] = useState('');

  const activeTicket = state.supportTickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const t = store.createSupportTicket({
      userId: state.customer.id,
      userName: state.customer.name,
      userRole: state.currentRole,
      category: newCategory,
      subject: newSubject.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      orderId: state.orders.length > 0 ? state.orders[0].id : undefined
    });

    setIsCreatingNew(false);
    setSelectedTicketId(t.id);
    setNewSubject('');
    setNewDescription('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    store.replySupportTicket(
      selectedTicketId,
      'user',
      state.customer.name,
      replyText.trim()
    );
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Support & Dispute Center</h2>
              <p className="text-[11px] text-slate-300">Wafa Care 24/7 Operations Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Tickets List */}
          <div className="w-full md:w-72 border-r border-slate-200 bg-slate-50 flex flex-col overflow-y-auto p-3 space-y-2">
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-3 rounded-2xl text-xs transition-colors shadow-xs"
            >
              + Create New Ticket
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 pt-2">
              Your Tickets
            </div>

            {state.supportTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  setIsCreatingNew(false);
                }}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                  selectedTicketId === ticket.id && !isCreatingNew
                    ? 'border-amber-500 bg-white text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400">{ticket.id}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ticket.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <h5 className="font-extrabold text-slate-900 truncate">{ticket.subject}</h5>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{ticket.description}</p>
              </button>
            ))}
          </div>

          {/* Right Pane: Active Ticket Thread or New Ticket Form */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {isCreatingNew ? (
              <form onSubmit={handleCreateTicket} className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
                <h3 className="font-extrabold text-lg text-slate-900">Open a New Support Ticket</h3>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Brief description of the issue"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Order Issue">Order Issue</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Rider Issue">Rider Issue</option>
                      <option value="Restaurant Issue">Restaurant Issue</option>
                      <option value="Account">Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description</label>
                  <textarea
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide full details, order ID or rider information..."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-md"
                  >
                    Submit Support Ticket
                  </button>
                </div>
              </form>
            ) : activeTicket ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Active Ticket Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      Ticket #{activeTicket.id} • {activeTicket.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">{activeTicket.subject}</h3>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-full uppercase">
                    {activeTicket.status}
                  </span>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 text-xs">
                  {activeTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5 font-bold">
                        {m.senderName} ({m.sender === 'user' ? 'You' : 'Wafa Support'})
                      </div>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl shadow-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-amber-600 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to support..."
                    className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-slate-400 text-xs">
                Select a ticket or open a new inquiry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
