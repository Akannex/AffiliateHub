
import React from 'react';
import { Product } from '../types';
import { X, ShoppingBag, ArrowRight, Trash2, ExternalLink } from 'lucide-react';
import { Button } from './Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartProducts: Product[];
  onRemove: (id: string) => void;
  onBuyNow: (product: Product) => void;
  theme: 'light' | 'dark';
  t: any;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartProducts, 
  onRemove,
  onBuyNow,
  theme,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/70 dark:bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-all duration-500 ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-900 dark:text-white leading-none">{t.cart.title}</h2>
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">{cartProducts.length} Items</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-400 active:scale-90">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
            {cartProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-6 px-10">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-700">
                  <ShoppingBag size={36} strokeWidth={1} className="text-slate-400 dark:text-slate-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[12px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">{t.cart.empty}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-bold">{t.cart.emptySub}</p>
                </div>
                <Button variant="secondary" size="md" className="rounded-xl border border-slate-300 dark:border-slate-700" onClick={onClose}>{t.cart.explore}</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartProducts.map(product => (
                  <div key={product.id} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 group animate-in slide-in-from-right-4 duration-300 hover:shadow-xl transition-all">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border dark:border-slate-700 shadow-sm">
                      <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-1 leading-tight uppercase tracking-tight">{product.title}</h4>
                      <p className="text-sm font-black text-indigo-700 dark:text-indigo-400 mt-1">{product.price}</p>
                      <div className="mt-3 flex items-center gap-5">
                        <button 
                          onClick={() => onBuyNow(product)}
                          className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1 hover:text-indigo-700 transition-colors"
                        >
                          {t.bio.buyNow} <ArrowRight size={10} />
                        </button>
                        <button 
                          onClick={() => onRemove(product.id)}
                          className="text-[9px] font-black uppercase tracking-widest text-rose-600 flex items-center gap-1 hover:text-rose-700 transition-colors"
                        >
                          <Trash2 size={10} /> {t.admin.list.empty === 'No products yet.' ? 'Remove' : 'Xóa'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartProducts.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <Button fullWidth size="lg" className="rounded-2xl gap-2 h-14" onClick={() => window.open(cartProducts[0].affiliateUrl, '_blank')}>
                STORE <ExternalLink size={16} />
              </Button>
              <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 text-center mt-5 uppercase tracking-[0.2em] leading-relaxed">
                {t.cart.redirect}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
