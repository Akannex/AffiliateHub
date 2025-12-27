
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  BarChart3, 
  LayoutDashboard, 
  ShoppingBag, 
  User, 
  LogOut, 
  Share2, 
  Instagram, 
  Youtube, 
  Facebook,
  Music as TiktokIcon,
  Link as LinkIcon,
  ChevronRight,
  Loader2,
  Settings,
  ArrowLeft,
  Camera,
  Sun,
  Moon,
  Lock,
  Eye,
  ShieldCheck,
  Grid,
  KeyRound,
  AlertCircle,
  Flame,
  TrendingUp,
  Award,
  Target,
  Globe,
  Info,
  Check,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Mail,
  Fingerprint,
  Trash2,
  Send,
  EyeOff,
  LogIn,
  AtSign,
  ShieldAlert,
  Languages,
  ChevronDown,
  Wand2,
  FileText,
  Shield,
  Cookie,
  Scale,
  ArrowUpDown,
  Clock,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import { 
  Product, 
  Platform, 
  BioProfile, 
  ClickLog, 
  AppState,
  Language
} from './types';
import { 
  INITIAL_PROFILE, 
  MOCK_PRODUCTS, 
  PLATFORM_COLORS,
  STATUS_COLORS
} from './constants';
import { extractProductMetadata } from './services/geminiService';
import { Button } from './components/Button';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const i18n = {
  en: {
    profile: {
      name: "Alex Johnson",
      bio: "Curating the best tech deals and home office aesthetic 🚀 ✨"
    },
    samples: [
      { id: '1', title: 'Mechanical Keyboard - NuPhy Air75 V2', price: '$129.00' },
      { id: '2', title: 'Minimalist Desk Mat (Grey)', price: '$25.00' },
      { id: '3', title: 'Logitech MX Master 3S Mouse', price: '$99.00' }
    ],
    nav: { dashboard: 'Dashboard', login: 'Login', logout: 'Logout', bio: 'View Bio' },
    auth: { welcome: 'Welcome Back', subtitle: 'Please login to continue', gmail: 'Login with Gmail', or: 'Or use password', userPlaceholder: 'Username or Email', passPlaceholder: 'Password', confirm: 'Confirm Login', back: 'Back to public page', error: 'Invalid username or password' },
    bio: { copied: 'Link Copied', hot: 'Hot', topClick: 'Top Click', favorite: 'Favorite', addToCart: 'Save', inCart: 'Saved', buyNow: 'Buy Now', empty: 'No products to display yet' },
    admin: { 
      tabs: { products: 'Products', profile: 'Profile', tracking: 'Marketing', security: 'Security' },
      status: { active: 'Active' },
      aiTranslate: 'AI Translate Profile',
      add: { title: 'Add New Product', placeholder: 'Paste your Affiliate link here...', tip: 'Gemini AI will auto-fetch name, price, and image.' },
      list: { title: 'Your List', empty: 'No products yet.', sort: { title: 'Order', newest: 'Newest', oldest: 'Oldest' } },
      profile: { title: 'Profile Settings', handle: 'Profile ID (Handle)', name: 'Display Name', bio: 'Short Bio', save: 'Save Changes', success: 'Profile updated successfully' },
      marketing: { title: 'Marketing Pixels', subtitle: 'Conversion Tracking' },
      security: { title: 'Security', subtitle: 'Manage your password', current: 'Current Password', new: 'New Password', confirm: 'Confirm New', button: 'Change Password' }
    },
    analytics: { back: 'Back to Dashboard', title: 'Traffic Hub', total: 'Total Clicks', sources: 'Traffic Sources', performance: 'Product Performance', noData: 'No data yet.' },
    cart: { title: 'Your Favorites', empty: 'Empty List', emptySub: 'Add items to view them later.', explore: 'Continue Exploring', redirect: 'Redirecting to official link' },
    footer: { copyright: 'MyAffiliateHub © 2024', terms: 'Terms of Use', privacy: 'Privacy Policy', cookie: 'Cookie Policy', compliance: 'Compliance', admin: 'ADMIN PANEL' },
    policies: {
      terms: {
        title: "Terms of Use",
        content: "By using MyAffiliateHub, you agree to these terms. This platform allows users to share affiliate links. We are not responsible for the content, quality, or delivery of products purchased via external links."
      },
      privacy: {
        title: "Privacy Policy",
        content: "We value your privacy. MyAffiliateHub uses local storage to save your theme preferences and cart items. We do not sell your personal data."
      },
      cookie: {
        title: "Cookie Policy",
        content: "This site uses essential 'cookies' (local storage) to function. These are used to remember your language choice and theme."
      },
      compliance: {
        title: "Compliance Statement",
        content: "In compliance with FTC guidelines, we disclose that links on this page may earn the creator a commission."
      }
    }
  },
  vi: {
    profile: {
      name: "Nguyễn Duy",
      bio: "Tổng hợp các deal công nghệ tốt nhất và góc làm việc tối giản 🚀 ✨"
    },
    samples: [
      { id: '1', title: 'Bàn phím cơ - NuPhy Air75 V2', price: '3.200.000₫' },
      { id: '2', title: 'Thảm trải bàn tối giản (Xám)', price: '650.000₫' },
      { id: '3', title: 'Chuột Logitech MX Master 3S', price: '2.500.000₫' }
    ],
    nav: { dashboard: 'Bảng điều khiển', login: 'Đăng nhập', logout: 'Đăng xuất', bio: 'Xem Hồ sơ' },
    auth: { welcome: 'Chào mừng trở lại', subtitle: 'Vui lòng đăng nhập để tiếp tục', gmail: 'Đăng nhập với Gmail', or: 'Hoặc dùng mật khẩu', userPlaceholder: 'Tên đăng nhập hoặc Email', passPlaceholder: 'Mật khẩu', confirm: 'Xác nhận Đăng nhập', back: 'Quay lại trang công khai', error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
    bio: { copied: 'Đã chép link', hot: 'Hot', topClick: 'Bán chạy', favorite: 'Yêu thích', addToCart: 'Lưu', inCart: 'Đã lưu', buyNow: 'Mua ngay', empty: 'Chưa có sản phẩm nào' },
    admin: { 
      tabs: { products: 'Sản phẩm', profile: 'Hồ sơ', tracking: 'Marketing', security: 'Bảo mật' },
      status: { active: 'Hoạt động' },
      aiTranslate: 'AI Dịch hồ sơ',
      add: { title: 'Thêm sản phẩm mới', placeholder: 'Dán link Affiliate tại đây...', tip: 'AI sẽ tự động lấy thông tin từ link.' },
      list: { title: 'Danh sách của bạn', empty: 'Chưa có sản phẩm.', sort: { title: 'Thứ tự', newest: 'Mới nhất', oldest: 'Cũ nhất' } },
      profile: { title: 'Cài đặt hồ sơ', handle: 'ID Hồ sơ (Handle)', name: 'Tên hiển thị', bio: 'Tiểu sử', save: 'Lưu thay đổi', success: 'Cập nhật thành công' },
      marketing: { title: 'Pixel Marketing', subtitle: 'Theo dõi chuyển đổi' },
      security: { title: 'Bảo mật', subtitle: 'Quản lý mật khẩu', current: 'Mật khẩu hiện tại', new: 'Mật khẩu mới', confirm: 'Xác nhận', button: 'Đổi mật khẩu' }
    },
    analytics: { back: 'Quay lại Dashboard', title: 'Thống kê', total: 'Tổng Click', sources: 'Nguồn truy cập', performance: 'Hiệu quả sản phẩm', noData: 'Chưa có dữ liệu.' },
    cart: { title: 'Yêu thích của bạn', empty: 'Danh sách trống', emptySub: 'Thêm sản phẩm để xem lại sau.', explore: 'Tiếp tục khám phá', redirect: 'Đang chuyển hướng đến trang gốc' },
    footer: { copyright: 'MyAffiliateHub © 2024', terms: 'Điều khoản', privacy: 'Bảo mật', cookie: 'Cookie', compliance: 'Tuân thủ', admin: 'QUẢN TRỊ' },
    policies: {
      terms: { title: "Điều khoản sử dụng", content: "Bằng việc sử dụng MyAffiliateHub, bạn đồng ý với các điều khoản này." },
      privacy: { title: "Chính sách bảo mật", content: "Chúng tôi tôn trọng quyền riêng tư của bạn." },
      cookie: { title: "Chính sách Cookie", content: "Trang web này sử dụng 'cookie' thiết yếu để hoạt động." },
      compliance: { title: "Tuyên bố tuân thủ", content: "Tuân theo hướng dẫn của FTC, chúng tôi công khai rằng các liên kết có thể tạo hoa hồng." }
    }
  },
  zh: {
    profile: { name: "阿利克斯", bio: "策划最佳技术交易和家庭办公美学 🚀 ✨" },
    samples: [
      { id: '1', title: '机械键盘 - NuPhy Air75 V2', price: '¥920.00' },
      { id: '2', title: '极简桌垫 (灰色)', price: '¥180.00' },
      { id: '3', title: '罗技 MX Master 3S 鼠标', price: '¥710.00' }
    ],
    nav: { dashboard: '仪表板', login: '登录', logout: '登出', bio: '查看资料' },
    auth: { welcome: '欢迎回来', subtitle: '请登录以继续', gmail: 'Gmail登录', or: '或使用密码', userPlaceholder: '用户名或邮箱', passPlaceholder: '密码', confirm: '确认登录', back: '返回公开页面', error: '用户名或密码错误' },
    bio: { copied: '链接已复制', hot: '热门', topClick: '高点击', favorite: '收藏', addToCart: '保存', inCart: '已保存', buyNow: '立即购买', empty: '暂无产品显示' },
    admin: { 
      tabs: { products: '产品', profile: '资料', tracking: '营销', security: '安全' },
      status: { active: '在线' },
      aiTranslate: 'AI 翻译个人资料',
      add: { title: '添加新产品', placeholder: '在此粘贴您的推广链接...', tip: 'AI 将自动获取名称、价格 and 图像。' },
      list: { title: '您的列表', empty: '暂无产品。', sort: { title: '排序', newest: '最新', oldest: '最旧' } },
      profile: { title: '资料设置', handle: '用户ID', name: '显示名称', bio: '简介', save: '保存更改', success: '资料更新成功' },
      marketing: { title: '营销像素', subtitle: '转化跟踪' },
      security: { title: '安全', subtitle: '管理您的密码', current: '当前密码', new: '新密码', confirm: '确认新密码', button: '更改密码' }
    },
    analytics: { back: '返回仪表板', title: '数据中心', total: '总点击量', sources: '流量来源', performance: '产品表现', noData: '暂无数据。' },
    cart: { title: '您的收藏', empty: '列表为空', emptySub: '添加项目以便稍后查看。', explore: '继续探索', redirect: '正在重定向至官方链接' },
    footer: { copyright: 'MyAffiliateHub © 2024', terms: '使用条款', privacy: '隐私政策', cookie: 'Cookie政策', compliance: '合规声明', admin: '管理后台' },
    policies: {
      terms: { title: "使用条款", content: "使用 MyAffiliateHub 即表示您同意 these 条款。" },
      privacy: { title: "隐私政策", content: "我们重视您的隐私。" },
      cookie: { title: "Cookie 政策", content: "本网站使用必要的“cookie”来运行。" },
      compliance: { title: "合规声明", content: "根据 FTC 指南，此页面上的链接可能会赚取佣金。" }
    }
  }
};

const LanguageSwitcher: React.FC<{ current: Language; onChange: (lang: Language) => void }> = ({ current, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const langs = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { id: 'zh', label: '中文', flag: '🇨🇳' }
  ];
  const activeLang = langs.find(l => l.id === current);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-700 active:scale-95">
        <span className="text-xl leading-none">{activeLang?.flag}</span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[45]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-[50] animate-in slide-in-from-top-2">
            {langs.map(l => (
              <button key={l.id} onClick={() => { onChange(l.id as Language); setIsOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${current === l.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <span className="text-lg leading-none">{l.flag}</span>
                <span>{l.label}</span>
                {current === l.id && <Check size={14} className="ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProtectedAdminRoute: React.FC<{ state: AppState; children: React.ReactNode }> = ({ state, children }) => {
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('myaffiliatehub_state');
    if (saved) return JSON.parse(saved);
    return {
      profile: INITIAL_PROFILE,
      products: MOCK_PRODUCTS,
      clickLogs: [],
      cart: [],
      theme: 'light',
      language: 'en',
      isAuthenticated: false,
      adminCredentials: { username: 'admin', password: '', isSetup: false }
    };
  });

  const t = i18n[state.language];
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const currentT = i18n[state.language];
    setState(prev => {
      const isDefaultProducts = prev.products.every(p => ['1', '2', '3'].includes(p.id)) && prev.products.length === 3;
      let nextProducts = prev.products;
      if (isDefaultProducts) {
        nextProducts = prev.products.map(p => {
          const sample = currentT.samples.find(s => s.id === p.id);
          return sample ? { ...p, title: sample.title, price: sample.price } : p;
        });
      }
      return {
        ...prev,
        profile: { ...prev.profile, name: currentT.profile.name, bio: currentT.profile.bio },
        products: nextProducts
      };
    });
  }, [state.language]);

  useEffect(() => {
    state.theme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    localStorage.setItem('myaffiliatehub_state', JSON.stringify(state));
  }, [state.theme, state]);

  const toggleTheme = () => setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  const changeLanguage = (lang: Language) => setState(prev => ({ ...prev, language: lang }));
  const logout = () => setState(prev => ({ ...prev, isAuthenticated: false }));

  const handleAddToCart = (id: string) => {
    if (!state.cart.includes(id)) {
      setState(prev => ({ ...prev, cart: [...prev.cart, id] }));
      setIsCartOpen(true);
    }
  };

  const handleRemoveFromCart = (id: string) => setState(prev => ({ ...prev, cart: prev.cart.filter(itemId => itemId !== id) }));

  const handleBuyNow = (product: Product) => {
    const log: ClickLog = { id: Math.random().toString(36).substr(2, 9), productId: product.id, platform: product.platform, timestamp: Date.now() };
    setState(prev => ({ ...prev, clickLogs: [...prev.clickLogs, log] }));
    window.open(product.affiliateUrl, '_blank');
  };

  const cartProducts = useMemo(() => state.products.filter(p => state.cart.includes(p.id)), [state.products, state.cart]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navigation state={state} t={t} toggleTheme={toggleTheme} changeLanguage={changeLanguage} onOpenCart={() => setIsCartOpen(true)} onLogout={logout} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<BioPageView state={state} t={t} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />} />
            <Route path="/login" element={<LoginView state={state} t={t} setState={setState} onLogin={() => setState(prev => ({ ...prev, isAuthenticated: true }))} isAuthenticated={state.isAuthenticated} />} />
            <Route path="/admin" element={<ProtectedAdminRoute state={state}><AdminView state={state} t={t} setState={setState} onLogout={logout} /></ProtectedAdminRoute>} />
            <Route path="/admin/analytics" element={<ProtectedAdminRoute state={state}><AnalyticsView state={state} t={t} logs={state.clickLogs} products={state.products} /></ProtectedAdminRoute>} />
            <Route path="/terms" element={<PolicyPageView t={t} type="terms" />} />
            <Route path="/privacy" element={<PolicyPageView t={t} type="privacy" />} />
            <Route path="/cookies" element={<PolicyPageView t={t} type="cookie" />} />
            <Route path="/compliance" element={<PolicyPageView t={t} type="compliance" />} />
          </Routes>
        </main>
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartProducts={cartProducts} onRemove={handleRemoveFromCart} onBuyNow={handleBuyNow} theme={state.theme} t={t} />
        <Footer isAuthenticated={state.isAuthenticated} t={t} />
      </div>
    </HashRouter>
  );
};

// Sub-components as needed (PolicyPageView, Navigation, BioPageView, LoginView, AdminView, AnalyticsView, Footer)
// (Using the same logic and modern styles from previous steps to maintain UI consistency)

const Navigation: React.FC<any> = ({ state, t, toggleTheme, changeLanguage, onOpenCart, onLogout }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={isAdminPath ? "/admin" : "/"} className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className={`w-8 h-8 ${isAdminPath ? 'bg-indigo-600' : 'bg-slate-950 dark:bg-white'} rounded-lg flex items-center justify-center text-white dark:text-slate-950 shadow-lg`}>
            {isAdminPath ? <ShieldCheck size={18} /> : 'A'}
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Hub</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher current={state.language} onChange={changeLanguage} />
          <button onClick={toggleTheme} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all"><Sun size={20} className="dark:text-yellow-400 hidden dark:block" /><Moon size={20} className="block dark:hidden" /></button>
          {state.isAuthenticated ? (
            <Link to="/admin" className="p-2.5 rounded-2xl text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 transition-all"><LayoutDashboard size={20} /></Link>
          ) : (
            <Link to="/login" className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all"><LogIn size={20} /></Link>
          )}
          <button onClick={onOpenCart} className="relative p-2.5 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-700 dark:text-slate-300 transition-all">
            <ShoppingBag size={20} />
            {state.cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-950 animate-bounce">{state.cart.length}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

const BioPageView: React.FC<any> = ({ state, t, onAddToCart, onBuyNow }) => {
  const { profile, products, cart, clickLogs } = state;
  const [copiedProfile, setCopiedProfile] = useState(false);
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2000);
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center mb-16 relative">
        <button onClick={handleShare} className="absolute top-0 right-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
          {copiedProfile ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
        </button>
        <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl mb-6"><img src={profile.avatarUrl} className="w-full h-full object-cover" /></div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{profile.name}</h1>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-sm mb-10 leading-relaxed">{profile.bio}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} t={t} onAddToCart={onAddToCart} onBuyNow={onBuyNow} isInCart={cart.includes(product.id)} />
        ))}
      </div>
      {products.length === 0 && <div className="text-center py-24 text-slate-500 font-black uppercase tracking-widest">{t.bio.empty}</div>}
    </div>
  );
};

const AdminView: React.FC<any> = ({ state, t, setState, onLogout }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsExtracting(true);
    const metadata = await extractProductMetadata(urlInput);
    if (metadata) {
      const newProduct: Product = { ...metadata, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() };
      setState((prev: any) => ({ ...prev, products: [newProduct, ...prev.products] }));
      setUrlInput('');
    }
    setIsExtracting(false);
  };

  const sortedProducts = useMemo(() => {
    return [...state.products].sort((a, b) => sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
  }, [state.products, sortOrder]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800"><img src={state.profile.avatarUrl} className="w-full h-full object-cover" /></div>
          <div><h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">{state.profile.name}</h2><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.admin.status.active}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/analytics" className="p-3.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all"><BarChart3 size={20} /></Link>
          <button onClick={onLogout} className="p-3.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-all"><LogOut size={20} /></button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Plus size={16} /> {t.admin.add.title}</h3>
            <form onSubmit={handleAddProduct} className="relative">
              <input type="url" placeholder={t.admin.add.placeholder} className="w-full pl-6 pr-16 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 text-sm font-bold text-slate-900 dark:text-white transition-all" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} disabled={isExtracting} />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3.5 bg-indigo-600 text-white rounded-2xl">{isExtracting ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}</button>
            </form>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.admin.list.title} ({state.products.length})</h3>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <button onClick={() => setSortOrder('newest')} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${sortOrder === 'newest' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Clock size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{t.admin.list.sort.newest}</span></button>
                <button onClick={() => setSortOrder('oldest')} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${sortOrder === 'oldest' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}><CalendarDays size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{t.admin.list.sort.oldest}</span></button>
              </div>
            </div>
            <div className="grid gap-4">
              {sortedProducts.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] flex items-center gap-5 border border-slate-200 dark:border-slate-800">
                  <img src={p.imageUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-xs truncate text-slate-900 dark:text-white uppercase">{p.title}</h4>
                    <div className="flex items-center gap-3"><span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase text-white ${PLATFORM_COLORS[p.platform]}`}>{p.platform}</span><span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400">{p.price}</span></div>
                  </div>
                  <button onClick={() => setState((prev: any) => ({ ...prev, products: prev.products.filter((item: any) => item.id !== p.id) }))} className="p-3.5 text-slate-500 hover:text-rose-600 transition-all"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginView: React.FC<any> = ({ state, t, setState, onLogin, isAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
      navigate('/admin');
    } else { setError(t.auth.error); }
  };
  return (
    <div className="max-w-md mx-auto px-6 py-24 flex items-center justify-center">
      <div className="w-full bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-8 text-center">{t.auth.welcome}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder={t.auth.userPlaceholder} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 text-sm font-bold outline-none" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder={t.auth.passPlaceholder} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 text-sm font-bold outline-none" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-rose-600 text-[10px] font-bold text-center">{error}</p>}
          <Button fullWidth type="submit" size="lg" className="h-16 rounded-2xl">{t.auth.confirm}</Button>
        </form>
      </div>
    </div>
  );
};

const AnalyticsView: React.FC<any> = ({ state, t, logs, products }) => {
  const topProducts = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((log: any) => { counts[log.productId] = (counts[log.productId] || 0) + 1; });
    return Object.entries(counts).map(([id, clicks]) => ({ name: products.find((p: any) => p.id === id)?.title || 'Product', clicks })).sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  }, [logs, products]);
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 mb-10"><ArrowLeft size={16} /> {t.analytics.back}</Link>
      <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl mb-8">
        <h2 className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-2">{t.analytics.total}</h2>
        <div className="text-8xl font-black">{logs.length}</div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        <h3 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">{t.analytics.performance}</h3>
        <div className="space-y-4">{topProducts.map((p, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-black text-slate-900 dark:text-white uppercase truncate pr-10"><span>{p.name}</span><span>{p.clicks}</span></div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-600" style={{ width: `${(p.clicks/(logs.length || 1))*100}%` }}></div></div>
          </div>
        ))}</div>
      </div>
    </div>
  );
};

const PolicyPageView: React.FC<any> = ({ t, type }) => {
  const policy = t.policies[type];
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 mb-10"><ArrowLeft size={16} /> Back</Link>
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-8">{policy.title}</h1>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{policy.content}</p>
      </div>
    </div>
  );
};

const Footer: React.FC<any> = ({ isAuthenticated, t }) => (
  <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
    <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t.footer.copyright}</p>
      <div className="flex justify-center gap-6 text-[9px] font-black uppercase text-slate-600 dark:text-slate-400">
        <Link to="/terms">{t.footer.terms}</Link><Link to="/privacy">{t.footer.privacy}</Link><Link to="/cookies">{t.footer.cookie}</Link>
      </div>
    </div>
  </footer>
);

export default App;
