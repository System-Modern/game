import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from './supabaseClient';
import { playBellSound } from './utils/audio';
import { exportSoldAccountsCSV } from './utils/csv';

// Components
import Toast from './components/layout/Toast';
import Header from './components/layout/Header';
import AuthScreen from './components/auth/AuthScreen';
import CPanelBuy from './components/cpanel/CPanelBuy';
import CPanelSold from './components/cpanel/CPanelSold';
import CPanelAdmin from './components/cpanel/CPanelAdmin';

// Modals
import BuyModal from './components/modals/BuyModal';
import SellModal from './components/modals/SellModal';
import ReviseModal from './components/modals/ReviseModal';
import OtpModal from './components/modals/OtpModal';

export default function App() {
  // Session & Auth State
  const [sessionUser, setSessionUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [loginRoleTarget, setLoginRoleTarget] = useState('pembeli_akun');

  // Input Form Auth
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputNama, setInputNama] = useState('');
  const [inputRole, setInputRole] = useState('pembeli_akun');
  const [adminSecretKey, setAdminSecretKey] = useState('');

  // Lupa Password
  const [forgotRoleTarget, setForgotRoleTarget] = useState('pembeli_akun');
  const [newPassword, setNewPassword] = useState('');

  // Application State
  const [activeTab, setActiveTab] = useState('buy');
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); 
  const [notification, setNotification] = useState(null); 

  // Notification Bell & Inbox History
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Accounts Data
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // Master Data Game
  const [gamesList] = useState(['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact', 'Valorant']);

  // Batch Account Generator Input
  const [generateCount, setGenerateCount] = useState(5);
  const [prefixEmail, setPrefixEmail] = useState('akun');
  const [defaultPassword, setDefaultPassword] = useState('pass12345');
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Account Input
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');

  // Modal State Buy
  const [assigningAcc, setAssigningAcc] = useState(null);
  const [game, setGame] = useState('');
  const [username, setUsername] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyEmailPembeli, setBuyEmailPembeli] = useState('');
  const [buyProofFile, setBuyProofFile] = useState(null);

  // Modal State Sold
  const [editingAcc, setEditingAcc] = useState(null);
  const [sellPrice, setSellPrice] = useState('');
  const [sellBuyerEmail, setSellBuyerEmail] = useState(''); 
  const [sellProofFile, setSellProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Modal State Revise Sold
  const [revisingAcc, setRevisingAcc] = useState(null);
  const [reviseSellPrice, setReviseSellPrice] = useState('');
  const [reviseBuyerEmail, setReviseBuyerEmail] = useState('');

  // Filters
  const [filterReadyId, setFilterReadyId] = useState('');
  const [filterSoldId, setFilterSoldId] = useState('');

  // Modal State OTP / Inbox
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [loadingInbox, setLoadingInbox] = useState(false);

  const notifDropdownRef = useRef(null);
  const previousInboxCountsRef = useRef({});

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const triggerEmailNotification = (msg, accountId, email) => {
    playBellSound();
    const newNotif = {
      id: Date.now(),
      message: msg,
      accountId: accountId,
      email: email,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotificationList(prev => [newNotif, ...prev]);
    setUnreadNotifCount(prev => prev + 1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedSession = sessionStorage.getItem('gv_session_user');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.role) {
          setSessionUser(parsed);
          if (parsed.role === 'penjual_akun') {
            setActiveTab('sold');
          } else {
            setActiveTab('buy');
          }
        }
      } catch (e) {
        sessionStorage.removeItem('gv_session_user');
      }
    }
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (!sessionUser) return;

    const checkNewEmailsBackground = async () => {
      try {
        const { data: activeAccs } = await supabase
          .from('accounts')
          .select('id, email')
          .neq('status', 'SOLD');

        if (!activeAccs || activeAccs.length === 0) return;

        for (const acc of activeAccs) {
          if (!acc.email) continue;
          try {
            const { data, error } = await supabase.functions.invoke('fetch-inbox', { body: { targetEmail: acc.email } });
            if (!error && data) {
              const currentMessages = Array.isArray(data) ? data : [];
              const prevCount = previousInboxCountsRef.current[acc.id] ?? currentMessages.length;

              if (currentMessages.length > prevCount) {
                const diff = currentMessages.length - prevCount;
                triggerEmailNotification(`Ada ${diff} email baru masuk untuk ${acc.email}!`, acc.id, acc.email);
              }

              previousInboxCountsRef.current[acc.id] = currentMessages.length;
            }
          } catch (err) {
            // Ignore background network errors
          }
        }
      } catch (e) {
        console.error('Background email check error:', e);
      }
    };

    const intervalId = setInterval(checkNewEmailsBackground, 10000);
    return () => clearInterval(intervalId);
  }, [sessionUser]);

  const handleTabChange = (tabKey) => {
    if (activeTab === tabKey) return;
    setPageLoading(true);
    setLoadingProgress(15);

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 30;
      });
    }, 60);

    setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setActiveTab(tabKey);
        setPageLoading(false);
        setLoadingProgress(0);
      }, 200);
    }, 350);
  };

  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleToggleOnBookSold = async (acc) => {
    const isCurrentlyOnBook = acc.status === 'ON_BOOK';
    
    if (isCurrentlyOnBook && acc.locked_by && acc.locked_by !== sessionUser.nama && sessionUser.role !== 'admin') {
      showToast(`Akun ini sedang di-book oleh penjual "${acc.locked_by}"!`, 'error');
      return;
    }

    const newStatus = isCurrentlyOnBook ? 'AVAILABLE' : 'ON_BOOK';
    const newLockedBy = isCurrentlyOnBook ? null : sessionUser.nama;

    const { error } = await supabase
      .from('accounts')
      .update({
        status: newStatus,
        locked_by: newLockedBy
      })
      .eq('id', acc.id);

    if (error) {
      showToast('Gagal memperbarui status On Book Penjualan: ' + error.message, 'error');
    } else {
      if (newStatus === 'ON_BOOK') {
        showToast(`Berhasil! Akun #${acc.displayId || acc.id} di-book atas nama Anda (${sessionUser.nama}).`, 'success');
      } else {
        showToast('Status On Book dibatalkan. Akun kembali tersedia untuk penjual lain.', 'info');
      }
      fetchAccounts();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', inputEmail.trim())
        .eq('password', inputPassword)
        .maybeSingle();

      if (error || !data) {
        showToast('Login Gagal: Email atau Password salah.', 'error');
        return;
      }

      if (data.role !== loginRoleTarget) {
        showToast(`Akses Ditolak: Role akun ini adalah "${data.role.toUpperCase()}".`, 'error');
        return;
      }

      setPageLoading(true);
      setLoadingProgress(20);

      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 35;
        });
      }, 80);

      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingProgress(100);

        setTimeout(() => {
          const userData = { email: data.email, role: data.role, nama: data.nama };
          setSessionUser(userData);
          sessionStorage.setItem('gv_session_user', JSON.stringify(userData));
          
          if (data.role === 'penjual_akun') {
            setActiveTab('sold');
          } else {
            setActiveTab('buy');
          }

          setInputEmail('');
          setInputPassword('');
          setPageLoading(false);
          setLoadingProgress(0);
          showToast(`Selamat datang kembali, ${data.nama}!`, 'success');
        }, 300);
      }, 500);

    } catch (err) {
      showToast('Gagal sistem saat autentikasi login.', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (inputRole === 'admin') {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'admin_secret_key')
          .maybeSingle();

        if (error || !data || adminSecretKey !== data.value) {
          showToast('Registrasi Ditolak: Kode Rahasia Admin salah!', 'error');
          return;
        }
      } catch (err) {
        showToast('Terjadi kesalahan saat validasi kunci admin.', 'error');
        return;
      }
    }

    try {
      const { error } = await supabase.from('app_users').insert([
        {
          email: inputEmail.trim(),
          password: inputPassword,
          role: inputRole,
          nama: inputNama || 'Pengguna Baru',
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          showToast('Pendaftaran Gagal: Email sudah terdaftar!', 'error');
        } else {
          showToast('Pendaftaran Gagal: ' + error.message, 'error');
        }
        return;
      }

      showToast('Registrasi akun baru berhasil! Silakan login.', 'success');
      setAuthMode('login');
      setInputPassword('');
      setAdminSecretKey('');
    } catch (err) {
      showToast('Gagal memproses pendaftaran akun.', 'error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Validasi Gagal: Password baru minimal 6 karakter.', 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', inputEmail.trim())
        .eq('role', forgotRoleTarget)
        .maybeSingle();

      if (error || !data) {
        showToast('Pemulihan Gagal: Email tidak ditemukan pada role tersebut.', 'error');
        return;
      }

      const { error: updateError } = await supabase
        .from('app_users')
        .update({ password: newPassword })
        .eq('email', inputEmail.trim())
        .eq('role', forgotRoleTarget);

      if (updateError) {
        showToast('Gagal memperbarui password.', 'error');
        return;
      }

      showToast('Password berhasil diubah! Silakan login.', 'success');
      setAuthMode('login');
      setInputEmail('');
      setNewPassword('');
    } catch (err) {
      showToast('Terjadi kendala saat mereset password.', 'error');
    }
  };

  const handleLogout = () => {
    setSessionUser(null);
    sessionStorage.removeItem('gv_session_user');
    setAuthMode('login');
    showToast('Anda telah berhasil keluar sesi (Logout).', 'info');
  };

  const handleGenerateAccounts = async (e) => {
    e.preventDefault();
    const count = parseInt(generateCount) || 0;
    if (count <= 0) {
      showToast('Jumlah generate minimal 1 akun!', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const newBatch = [];
      const timestamp = Date.now();
      for (let i = 1; i <= count; i++) {
        const cleanPrefix = (prefixEmail.trim() || 'akun').toLowerCase().replace(/[^a-z0-9]/g, '');
        newBatch.push({
          email: `${cleanPrefix}${timestamp.toString().slice(-6)}${i}@1secmail.com`,
          password: defaultPassword,
          game: 'Belum Diisi',
          username: '-',
          buy_price: 0,
          sell_price: 0,
          is_sold: false,
          status: 'AVAILABLE',
          locked_by: null,
          bought_by: null,
          sold_by: null,
          buyer_email: '-'
        });
      }

      const { error } = await supabase.from('accounts').insert(newBatch);
      if (error) throw error;

      showToast(`Berhasil men-generate ${count} akun baru ke database bersama!`, 'success');
      fetchAccounts();
    } catch (err) {
      showToast('Gagal generate akun: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveManualEmail = async (e) => {
    e.preventDefault();
    if (!manualEmail || !manualPassword) {
      showToast('Email dan Password akun wajib diisi!', 'error');
      return;
    }

    const { error } = await supabase.from('accounts').insert([
      {
        email: manualEmail.trim(),
        password: manualPassword.trim(),
        game: 'Belum Diisi',
        username: '-',
        buy_price: 0,
        sell_price: 0,
        is_sold: false,
        status: 'AVAILABLE',
        locked_by: null,
        bought_by: null,
        sold_by: null,
        buyer_email: '-'
      },
    ]);

    if (error) {
      showToast('Gagal menyimpan stok ke database: ' + error.message, 'error');
    } else {
      showToast('Stok akun baru berhasil ditambahkan ke database bersama!', 'success');
      setManualEmail('');
      setManualPassword('');
      fetchAccounts();
    }
  };

  const uploadImage = async (file, folder = 'proofs') => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('account-proofs').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('account-proofs').getPublicUrl(fileName);
      return data?.publicUrl || null;
    } catch (error) {
      showToast('Gagal mengunggah foto bukti: ' + error.message, 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAssignGame = async (e) => {
    e.preventDefault();
    if (!game || !username) {
      showToast('Nama Game dan Username wajib diisi lengkap!', 'error');
      return;
    }

    if (assigningAcc.bought_by && assigningAcc.bought_by !== sessionUser.nama && sessionUser.role !== 'admin') {
      showToast(`Gagal! Akun ini sudah di-take oleh user lain (${assigningAcc.bought_by}).`, 'error');
      setAssigningAcc(null);
      fetchAccounts();
      return;
    }

    let buyProofUrl = assigningAcc?.buy_proof_url || null;
    if (buyProofFile) {
      buyProofUrl = await uploadImage(buyProofFile, 'buy_proofs');
    }

    const { error } = await supabase
      .from('accounts')
      .update({
        game,
        username,
        buy_price: parseFloat(buyPrice) || 0,
        buy_proof_url: buyProofUrl,
        bought_by: assigningAcc?.bought_by || sessionUser.nama, 
        buyer_email: buyEmailPembeli.trim() || '-',
      })
      .eq('id', assigningAcc.id);

    if (error) {
      showToast('Gagal memperbarui data game: ' + error.message, 'error');
    } else {
      showToast('Data pembelian akun berhasil disimpan!', 'success');
      setAssigningAcc(null);
      setGame('');
      setUsername('');
      setBuyPrice('');
      setBuyEmailPembeli('');
      setBuyProofFile(null);
      fetchAccounts();
    }
  };

  const handleSaveSellDetails = async (e) => {
    e.preventDefault();
    if (!sellPrice) {
      showToast('Harga jual (omset) wajib diisi!', 'error');
      return;
    }

    const { data: latestAcc, error: fetchErr } = await supabase
      .from('accounts')
      .select('status, locked_by, is_sold')
      .eq('id', editingAcc.id)
      .single();

    if (fetchErr || !latestAcc) {
      showToast('Gagal memverifikasi status akun terbaru.', 'error');
      return;
    }

    if (latestAcc.is_sold || latestAcc.status === 'SOLD') {
      showToast('Gagal! Akun ini sudah terjual lebih dulu oleh seller lain.', 'error');
      setEditingAcc(null);
      fetchAccounts();
      return;
    }

    if (latestAcc.status === 'ON_BOOK' && latestAcc.locked_by && latestAcc.locked_by !== sessionUser.nama && sessionUser.role !== 'admin') {
      showToast(`Gagal! Akun ini sedang di-book oleh penjual "${latestAcc.locked_by}".`, 'error');
      setEditingAcc(null);
      fetchAccounts();
      return;
    }

    let sellProofUrl = editingAcc?.proof_url || null;
    if (sellProofFile) {
      sellProofUrl = await uploadImage(sellProofFile, 'sell_proofs');
    }

    const updatePayload = {
      sell_price: parseFloat(sellPrice) || 0,
      proof_url: sellProofUrl,
      sold_by: sessionUser.nama, 
      is_sold: true,
      status: 'SOLD',
      locked_by: null
    };

    if (sellBuyerEmail && sellBuyerEmail.trim() !== '') {
      updatePayload.buyer_email = sellBuyerEmail.trim();
    }

    const { error } = await supabase
      .from('accounts')
      .update(updatePayload)
      .eq('id', editingAcc.id);

    if (error) {
      showToast('Gagal memperbarui status penjualan: ' + error.message, 'error');
    } else {
      showToast('Akun berhasil dicatat terjual!', 'success');
      setEditingAcc(null);
      setSellPrice('');
      setSellBuyerEmail('');
      setSellProofFile(null);
      fetchAccounts();
    }
  };

  const handleSaveRevisedSoldDetails = async (e) => {
    e.preventDefault();
    if (!revisingAcc) return;

    const isOwner = revisingAcc.sold_by === sessionUser.nama || revisingAcc.bought_by === sessionUser.nama;
    const isAdmin = sessionUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      showToast('Akses Ditolak: Anda bukan pembuat data ini!', 'error');
      setRevisingAcc(null);
      return;
    }

    if (!reviseSellPrice) {
      showToast('Harga jual tidak boleh kosong!', 'error');
      return;
    }

    const { error } = await supabase
      .from('accounts')
      .update({
        sell_price: parseFloat(reviseSellPrice) || 0,
        buyer_email: reviseBuyerEmail.trim() || '-'
      })
      .eq('id', revisingAcc.id);

    if (error) {
      showToast('Gagal memperbarui data penjualan: ' + error.message, 'error');
    } else {
      showToast('Data penjualan berhasil diperbarui!', 'success');
      setRevisingAcc(null);
      setReviseSellPrice('');
      setReviseBuyerEmail('');
      fetchAccounts();
    }
  };

  const fetchEmailInbox = async (targetEmail) => {
    setLoadingInbox(true);
    try {
      // 1. Ambil data pesan yang sudah tersimpan di database Supabase terlebih dahulu
      const { data: dbData } = await supabase
        .from('account_inbox')
        .select('*')
        .eq('account_email', targetEmail)
        .order('received_at', { ascending: false });

      if (dbData && dbData.length > 0) {
        setInbox(
          dbData.map((item) => ({
            id: item.message_id || String(item.id),
            from: item.sender,
            subject: item.subject,
            textBody: item.body_text,
            received_at: item.received_at,
          }))
        );
      }

      // 2. Tarik pesan terbaru via Edge Function (dan otomatis simpan ke database)
      const { data, error } = await supabase.functions.invoke('fetch-inbox', { body: { targetEmail } });
      if (!error && Array.isArray(data) && data.length > 0) {
        setInbox(data);
      } else if (!dbData || dbData.length === 0) {
        setInbox(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching inbox:', err);
    } finally {
      setLoadingInbox(false);
    }
  };

  const handleDownloadCSV = () => {
    const result = exportSoldAccountsCSV(safeAccounts);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  const safeAccounts = useMemo(() => Array.isArray(accounts) ? accounts : [], [accounts]);
  
  const accountsWithDisplayId = useMemo(() => {
    return safeAccounts.map((acc, idx) => ({
      ...acc,
      displayId: idx + 1
    }));
  }, [safeAccounts]);

  const readyStock = useMemo(() => {
    let list = accountsWithDisplayId.filter((acc) => acc && !acc.is_sold && acc.status !== 'SOLD');
    if (filterReadyId.trim() !== '') {
      list = list.filter((acc) => String(acc.displayId).includes(filterReadyId.trim()));
    }
    return list;
  }, [accountsWithDisplayId, filterReadyId]);

  const soldStock = useMemo(() => {
    let list = accountsWithDisplayId.filter((acc) => acc && (acc.is_sold || acc.status === 'SOLD'));
    if (filterSoldId.trim() !== '') {
      list = list.filter((acc) => String(acc.displayId).includes(filterSoldId.trim()));
    }
    return list;
  }, [accountsWithDisplayId, filterSoldId]);

  const financialSummary = useMemo(() => {
    const soldList = safeAccounts.filter(acc => acc && (acc.is_sold || acc.status === 'SOLD'));
    const totalOmset = soldList.reduce((acc, curr) => acc + (Number(curr.sell_price) || 0), 0);
    return { totalOmset, totalTerjual: soldList.length };
  }, [safeAccounts]);

  const employeeKpiList = useMemo(() => {
    const kpiData = safeAccounts.filter(acc => acc && (acc.is_sold || acc.status === 'SOLD')).reduce((acc, curr) => {
      const emp = curr.sold_by || curr.bought_by || 'Admin';
      if (!acc[emp]) {
        acc[emp] = { name: emp, count: 0, revenue: 0 };
      }
      const sell = Number(curr.sell_price) || 0;
      acc[emp].count += 1;
      acc[emp].revenue += sell;
      return acc;
    }, {});
    const list = Object.values(kpiData).sort((a, b) => b.count - a.count);
    const maxCount = list.length > 0 ? Math.max(...list.map(item => item.count)) : 1;
    return list.map(item => ({
      ...item,
      percentage: maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0
    }));
  }, [safeAccounts]);

  const handleOpenAssignModal = (acc) => {
    setAssigningAcc(acc);
    setGame(acc.game !== 'Belum Diisi' ? acc.game : (gamesList[0] || ''));
    setUsername(acc.username !== '-' ? acc.username : '');
    setBuyPrice(acc.buy_price || '');
    setBuyEmailPembeli(acc.buyer_email && acc.buyer_email !== '-' ? acc.buyer_email : '');
  };

  const handleOpenSellModal = (acc) => {
    setEditingAcc(acc); 
    setSellPrice(''); 
    setSellBuyerEmail(acc.buyer_email && acc.buyer_email !== '-' ? acc.buyer_email : '');
  };

  const handleOpenReviseModal = (acc) => {
    setRevisingAcc(acc);
    setReviseSellPrice(acc.sell_price || '');
    setReviseBuyerEmail(acc.buyer_email && acc.buyer_email !== '-' ? acc.buyer_email : '');
  };

  const handleCheckOtp = (acc) => {
    setSelectedAccount(acc);
    fetchEmailInbox(acc.email);
  };

  const handleSelectNotificationAccount = (notifItem) => {
    const targetAcc = safeAccounts.find(acc => acc.id === notifItem.accountId || acc.email === notifItem.email);
    if (targetAcc) {
      setSelectedAccount(targetAcc);
      fetchEmailInbox(targetAcc.email);
      setShowNotificationDropdown(false);
    } else {
      showToast('Data akun terkait tidak ditemukan di memori lokal.', 'error');
    }
  };

  // Auth Screen
  if (!sessionUser) {
    return (
      <div className="relative min-h-screen bg-slate-950">
        <Toast notification={notification} onClose={() => setNotification(null)} />

        {pageLoading && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-200 ease-out" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        )}

        <AuthScreen
          authMode={authMode}
          setAuthMode={setAuthMode}
          loginRoleTarget={loginRoleTarget}
          setLoginRoleTarget={setLoginRoleTarget}
          inputEmail={inputEmail}
          setInputEmail={setInputEmail}
          inputPassword={inputPassword}
          setInputPassword={setInputPassword}
          inputNama={inputNama}
          setInputNama={setInputNama}
          inputRole={inputRole}
          setInputRole={setInputRole}
          adminSecretKey={adminSecretKey}
          setAdminSecretKey={setAdminSecretKey}
          forgotRoleTarget={forgotRoleTarget}
          setForgotRoleTarget={setForgotRoleTarget}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          pageLoading={pageLoading}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleForgotPassword={handleForgotPassword}
        />
      </div>
    );
  }

  // Dashboard Application
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      <Toast notification={notification} onClose={() => setNotification(null)} />

      {pageLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-200 ease-out" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      )}

      <Header
        sessionUser={sessionUser}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        loadingAccounts={loadingAccounts}
        onRefresh={fetchAccounts}
        showNotificationDropdown={showNotificationDropdown}
        setShowNotificationDropdown={setShowNotificationDropdown}
        notificationList={notificationList}
        setNotificationList={setNotificationList}
        unreadNotifCount={unreadNotifCount}
        setUnreadNotifCount={setUnreadNotifCount}
        onSelectNotificationAccount={handleSelectNotificationAccount}
        onLogout={handleLogout}
        buyCount={safeAccounts.filter(acc => acc && !acc.is_sold && acc.status !== 'SOLD').length}
        soldCount={safeAccounts.filter(acc => acc && (acc.is_sold || acc.status === 'SOLD')).length}
        notifDropdownRef={notifDropdownRef}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {activeTab === 'buy' && (sessionUser.role === 'admin' || sessionUser.role === 'pembeli_akun') && (
          <CPanelBuy
            sessionUser={sessionUser}
            readyStock={readyStock}
            gamesList={gamesList}
            generateCount={generateCount}
            setGenerateCount={setGenerateCount}
            prefixEmail={prefixEmail}
            setPrefixEmail={setPrefixEmail}
            defaultPassword={defaultPassword}
            setDefaultPassword={setDefaultPassword}
            isGenerating={isGenerating}
            handleGenerateAccounts={handleGenerateAccounts}
            manualEmail={manualEmail}
            setManualEmail={setManualEmail}
            manualPassword={manualPassword}
            setManualPassword={setManualPassword}
            handleSaveManualEmail={handleSaveManualEmail}
            onOpenAssignModal={handleOpenAssignModal}
            onCheckOtp={handleCheckOtp}
            showToast={showToast}
          />
        )}

        {activeTab === 'sold' && (sessionUser.role === 'admin' || sessionUser.role === 'penjual_akun') && (
          <CPanelSold
            sessionUser={sessionUser}
            readyStock={readyStock}
            soldStock={soldStock}
            financialSummary={financialSummary}
            filterReadyId={filterReadyId}
            setFilterReadyId={setFilterReadyId}
            filterSoldId={filterSoldId}
            setFilterSoldId={setFilterSoldId}
            handleToggleOnBookSold={handleToggleOnBookSold}
            onOpenSellModal={handleOpenSellModal}
            onOpenReviseModal={handleOpenReviseModal}
            onCheckOtp={handleCheckOtp}
            onDownloadCSV={handleDownloadCSV}
            showToast={showToast}
          />
        )}

        {activeTab === 'admin' && sessionUser.role === 'admin' && (
          <CPanelAdmin
            employeeKpiList={employeeKpiList}
          />
        )}
      </div>

      {/* Modals */}
      <BuyModal
        assigningAcc={assigningAcc}
        gamesList={gamesList}
        game={game}
        setGame={setGame}
        username={username}
        setUsername={setUsername}
        buyPrice={buyPrice}
        setBuyPrice={setBuyPrice}
        buyEmailPembeli={buyEmailPembeli}
        setBuyEmailPembeli={setBuyEmailPembeli}
        setBuyProofFile={setBuyProofFile}
        uploading={uploading}
        sessionUser={sessionUser}
        handleSaveAssignGame={handleSaveAssignGame}
        onClose={() => setAssigningAcc(null)}
      />

      <SellModal
        editingAcc={editingAcc}
        sellPrice={sellPrice}
        setSellPrice={setSellPrice}
        sellBuyerEmail={sellBuyerEmail}
        setSellBuyerEmail={setSellBuyerEmail}
        setSellProofFile={setSellProofFile}
        uploading={uploading}
        sessionUser={sessionUser}
        handleSaveSellDetails={handleSaveSellDetails}
        onClose={() => setEditingAcc(null)}
      />

      <ReviseModal
        revisingAcc={revisingAcc}
        reviseSellPrice={reviseSellPrice}
        setReviseSellPrice={setReviseSellPrice}
        reviseBuyerEmail={reviseBuyerEmail}
        setReviseBuyerEmail={setReviseBuyerEmail}
        handleSaveRevisedSoldDetails={handleSaveRevisedSoldDetails}
        onClose={() => setRevisingAcc(null)}
      />

      <OtpModal
        selectedAccount={selectedAccount}
        inbox={inbox}
        loadingInbox={loadingInbox}
        onRefreshInbox={fetchEmailInbox}
        onClose={() => setSelectedAccount(null)}
      />
    </div>
  );
}