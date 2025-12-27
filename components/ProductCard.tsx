
import React from 'react';
import { Product, Platform } from '../types';
import { PLATFORM_COLORS, STATUS_COLORS } from '../constants';
import { ShoppingCart, ExternalLink, Share2, Check, Flame, TrendingUp, Star, Link as LinkIcon, Send } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  t: any;
  onAddToCart: (id: string) => void;
  onBuyNow: (product: Product) => void;
  isInCart: boolean;
  performanceStatus?: 'HOT' | 'TOP_CLICK' | 'HIGH_INTEREST' | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  t,
  onAddToCart, 
  onBuyNow,
  isInCart,
  performanceStatus
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: product.title,
      text: `Check out this product: ${product.title}`,
      url: product.affiliateUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(product.affiliateUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const truncateTitle = (title: string, wordLimit: number) => {
    const words = title.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return title;
  };

  const displayTitle = truncateTitle(product.title, 18);

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'HOT': return t.bio.hot;
      case 'TOP_CLICK': return t.bio.topClick;
      default: return t.bio.favorite;
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-slate-200 dark:border-slate-800 flex flex-col relative h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800/30">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {performanceStatus && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-wider shadow-lg bg-gradient-to-r ${
              performanceStatus === 'HOT' ? STATUS_COLORS.HOT : 
              performanceStatus === 'TOP_CLICK' ? STATUS_COLORS.TOP_CLICK : 
              STATUS_COLORS.CONVERSION
            }`}>
              {performanceStatus === 'HOT' ? <Flame size={10} /> : performanceStatus === 'TOP_CLICK' ? <TrendingUp size={10} /> : <Star size={10} />}
              {getStatusLabel(performanceStatus)}
            </div>
          )}
        </div>

        <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[8px] font-black text-white uppercase tracking-widest shadow-sm ring-1 ring-white/20 ${PLATFORM_COLORS[product.platform]}`}>
          {product.platform}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={handleShare}
            className={`p-2.5 backdrop-blur-md rounded-xl shadow-lg border transition-all active:scale-90 ${
              copied 
              ? 'bg-green-600 border-green-500 text-white' 
              : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            {copied ? <Check size={14} /> : <Send size={14} />}
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-black text-slate-900 dark:text-slate-50 text-[13px] line-clamp-2 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
            {displayTitle}
          </h3>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
             <span className="text-lg font-black tracking-tight text-indigo-700 dark:text-indigo-400">{product.price}</span>
             <button 
               onClick={handleShare}
               className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors ${copied ? 'text-green-600' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400'}`}
             >
               {copied ? t.bio.copied : 'Copy link'}
               {copied ? <Check size={10} /> : <LinkIcon size={10} />}
             </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onBuyNow(product)}
              className="flex items-center justify-center gap-1.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-md active:scale-95"
            >
              {t.bio.buyNow} <ExternalLink size={10} strokeWidth={3} />
            </button>
            
            <button 
              onClick={() => onAddToCart(product.id)}
              disabled={isInCart}
              className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                isInCart 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white'
              }`}
            >
              {isInCart ? t.bio.inCart : t.bio.addToCart}
              {!isInCart && <ShoppingCart size={10} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
