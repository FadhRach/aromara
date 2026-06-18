'use client';

import { useState, useEffect } from 'react';
import IonIcon from '@/components/shared/IonIcon';
import { showAlert } from '@/lib/sweetalert';

interface NotifPrefs {
  email_inquiries: boolean;
  email_orders: boolean;
  email_marketing: boolean;
  sms_notifications: boolean;
}

const DEFAULT_NOTIF_PREFS: NotifPrefs = {
  email_inquiries: true,
  email_orders: true,
  email_marketing: false,
  sms_notifications: false,
};

const NOTIF_LABELS: { key: keyof NotifPrefs; label: string }[] = [
  { key: 'email_inquiries', label: 'Notifikasi email untuk inquiry baru' },
  { key: 'email_orders', label: 'Notifikasi email untuk order baru' },
  { key: 'email_marketing', label: 'Email promosi dan marketing' },
  { key: 'sms_notifications', label: 'Notifikasi SMS untuk update penting' },
];

export default function SupplierSettings() {
  const [supplierId, setSupplierId] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF_PREFS);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSupplierId(user.id);
    }
    const saved = localStorage.getItem('notif_prefs');
    if (saved) {
      try {
        setNotifPrefs(JSON.parse(saved));
      } catch {
        // keep defaults
      }
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      showAlert.error('Password tidak cocok', 'Password baru dan konfirmasi harus sama');
      return;
    }

    if (passwordData.new_password.length < 8) {
      showAlert.warning('Password terlalu pendek', 'Password minimal 8 karakter');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/supplier/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          supplier_id: supplierId,
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });
      const result = await response.json();

      if (result.success) {
        showAlert.success('Berhasil!', 'Password berhasil diubah');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        showAlert.error('Gagal', result.error || 'Gagal mengubah password');
      }
    } catch {
      showAlert.error('Error', 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotifToggle = (key: keyof NotifPrefs) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifPrefs = () => {
    setNotifLoading(true);
    localStorage.setItem('notif_prefs', JSON.stringify(notifPrefs));
    setTimeout(() => {
      setNotifLoading(false);
      showAlert.success('Tersimpan', 'Preferensi notifikasi berhasil disimpan');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Kelola pengaturan akun Anda</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ubah Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Saat Ini
            </label>
            <input
              type="password"
              value={passwordData.current_password}
              onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru
            </label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {passwordLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <IonIcon name="lock-closed-outline" className="text-xl mr-2" />
                Ubah Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferensi Notifikasi</h2>
        <div className="space-y-3">
          {NOTIF_LABELS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={notifPrefs[key]}
                onChange={() => handleNotifToggle(key)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-900">{label}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleSaveNotifPrefs}
          disabled={notifLoading}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {notifLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Menyimpan...
            </>
          ) : (
            'Simpan Preferensi'
          )}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Nonaktifkan Akun</h3>
              <p className="text-sm text-gray-600 mt-1">
                Hubungi tim Aromara untuk menonaktifkan akun Anda.
              </p>
            </div>
            <a
              href="mailto:support@aromara.id?subject=Deactivate Account"
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Hubungi Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
