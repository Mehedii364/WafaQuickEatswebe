import React, { useRef } from 'react';
import { X, Printer, Download, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';
import { AppState } from '../../services/store';

interface InvoiceModalProps {
  order: Order;
  state: AppState;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, state, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate downloadable text / json / formatted receipt
    const invoiceText = `
========================================
           WAFA QUICKEATS ⚡
  Fast Food. Live Tracking. Smart Delivery.
  Brand: Wafa Zone by Mehedi364
  Official: wafaquickeats.site.je
========================================
INVOICE NO : ${order.invoiceNumber}
ORDER ID   : ${order.id}
DATE       : ${new Date(order.createdAt).toLocaleString()}
STATUS     : ${order.status.toUpperCase()}
PAYMENT    : ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})
----------------------------------------
RESTAURANT : ${order.restaurantName}
ADDRESS    : ${order.restaurantAddress}
CUSTOMER   : ${order.customerName} (${order.customerPhone})
DELIVER TO : ${order.deliveryAddress.fullAddress}
RIDER      : ${order.riderName || 'Assigned Pilot'} (${order.riderPhone || 'N/A'})
----------------------------------------
ITEMS:
${order.items
  .map(
    (item, i) =>
      `${i + 1}. ${item.name} x ${item.quantity} = ৳${item.totalPrice}${
        item.selectedVariant ? ` (${item.selectedVariant.name})` : ''
      }`
  )
  .join('\n')}
----------------------------------------
Subtotal     : ৳${order.subtotal}
Discount     : -৳${order.discount}
Points Disc. : -৳${order.pointsDiscount}
Delivery Fee : ৳${order.deliveryFee}
Service Fee  : ৳${order.serviceFee}
VAT/Tax (5%) : ৳${order.taxVat}
========================================
GRAND TOTAL  : ৳${order.grandTotal}
========================================
Thank you for ordering with Wafa QuickEats!
Developed by Md. Mehedi Hasan (Mehedi364)
`;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-white">
              Official Tax Invoice
            </span>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Invoice"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="Download Receipt"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div
          ref={invoiceRef}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 bg-white"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                  ⚡
                </span>
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Wafa QuickEats
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Wafa Zone by Mehedi364 • <span className="font-semibold text-slate-700">wafaquickeats.site.je</span>
              </p>
              <p className="text-[11px] text-slate-400">VAT Reg: BIN-009182746-0102</p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Invoice Reference
              </span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-slate-900 block mt-0.5">
                {order.invoiceNumber}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Order ID: {order.id}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Billing & Order Participants Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Kitchen Partner
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">{order.restaurantName}</h4>
              <p className="text-slate-600 mt-0.5">{order.restaurantAddress}</p>
              <p className="text-slate-500">{order.restaurantPhone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To Customer
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">{order.customerName}</h4>
              <p className="text-slate-600 mt-0.5">{order.deliveryAddress.fullAddress}</p>
              <p className="text-slate-500">{order.customerPhone}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  Paid via {order.paymentMethod}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Rider: {order.riderName || 'Tanvir Ahmed'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Item & Customizations</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <tr key={item.id} className="text-slate-800">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{item.name}</div>
                      {item.selectedVariant && (
                        <div className="text-[10px] text-slate-500">
                          Portion: {item.selectedVariant.name}
                        </div>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="text-[10px] text-slate-500">
                          Addons: {item.selectedAddons.map((a) => a.name).join(', ')}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <div className="text-[10px] text-amber-700 italic">
                          Note: {item.specialInstructions}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-medium text-slate-600">
                      ৳{item.unitPrice}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      ৳{item.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-slate-500 max-w-xs space-y-1">
              <p className="font-bold text-slate-700">Notice:</p>
              <p>
                This invoice is cryptographically recorded in the Wafa QuickEats ledger and is immutable.
                Price changes to menu dishes do not alter completed historical orders.
              </p>
            </div>

            <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">৳{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              {order.pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Points Discount</span>
                  <span>-৳{order.pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">৳{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Fee</span>
                <span className="font-bold text-slate-900">৳{order.serviceFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax (5%)</span>
                <span className="font-bold text-slate-900">৳{order.taxVat}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-950">
                <span>Grand Total</span>
                <span className="text-base text-amber-600 font-black">৳{order.grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Wafa QuickEats ⚡ • Fast Food. Live Tracking. Smart Delivery. • Developer: Md. Mehedi Hasan (Mehedi364)
          </div>
        </div>
      </div>
    </div>
  );
};
