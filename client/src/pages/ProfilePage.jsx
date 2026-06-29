import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userService.getMe();
        setUser(response.user);
        setProfileForm({ firstName: response.user.firstName || '', lastName: response.user.lastName || '', email: response.user.email || '' });
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load profile.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [addToast]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await userService.updateMe(profileForm);
      setUser(response.user);
      addToast('Profile updated.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to update profile.', 'error');
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      await userService.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      addToast('Password updated.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to change password.', 'error');
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" /></div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-900">Name:</span> {user?.firstName} {user?.lastName}</p>
          <p><span className="font-semibold text-slate-900">Email:</span> {user?.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Edit profile</h2>
          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={profileForm.firstName} onChange={(event) => setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" placeholder="First name" required />
              <input value={profileForm.lastName} onChange={(event) => setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" placeholder="Last name" required />
            </div>
            <input type="email" value={profileForm.email} onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" placeholder="Email address" required />
            <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">Save changes</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" placeholder="Current password" required />
            <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900" placeholder="New password" required />
            <button type="submit" className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700">Update password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
