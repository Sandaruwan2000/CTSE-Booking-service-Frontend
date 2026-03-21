import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/* ─── Confirmation / Error Modal ─────────────────────────────────── */
const DeleteModal = ({ user, onConfirm, onClose, loading, errorMsg }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !loading && onClose()} />

    {/* Card */}
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-5">

      {/* ── ERROR STATE: user has orders ── */}
      {errorMsg ? (
        <>
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 border border-orange-200 mx-auto">
            <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Cannot Delete User</h2>
            {/* Prominent error box */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-left">
              <p className="text-sm font-semibold text-orange-700 flex items-start gap-2">
                <span className="text-base mt-0.5">⚠️</span>
                <span>{errorMsg}</span>
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              You must cancel or complete all orders for this user before their account can be removed.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
          >
            OK, Got It
          </button>
        </>
      ) : (
        /* ── CONFIRM STATE ── */
        <>
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 border border-red-200 mx-auto">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Delete User Account</h2>
            <p className="text-slate-500 text-sm">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-700">{user.name}</span>?
              <br />
              <span className="text-xs text-slate-400 font-mono">{user.email}</span>
            </p>
            <p className="mt-3 text-xs text-red-500 font-medium">⚠️ This action cannot be undone.</p>
          </div>

          <div className="flex gap-3 mt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking…
                </>
              ) : (
                'Yes, Delete'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

/* ─── Success Toast ───────────────────────────────────────────────── */
const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-lg max-w-sm">
      <span className="text-lg">✅</span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────── */
const ManageUsers = () => {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // user object awaiting delete
  const [deleting, setDeleting] = useState(false);
  const [modalError, setModalError] = useState('');      // error shown INSIDE the modal
  const [successMsg, setSuccessMsg] = useState('');      // success toast message

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      if (data && data.users) setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  /* Open modal — always allowed for non-admin, non-self users */
  const handleDeleteClick = (user) => {
    setModalError('');       // reset any previous error
    setDeleteTarget(user);
  };

  /* Called when admin clicks "Yes, Delete" inside the modal */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setModalError('');
    try {
      await deleteUser(deleteTarget._id);
      // Remove from local list instantly
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setSuccessMsg(`"${deleteTarget.name}" has been deleted successfully.`);
      setDeleteTarget(null); // close modal on success
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Failed to delete user. Please try again.';
      // Show error INSIDE the modal — do NOT close it
      setModalError(msg);
    } finally {
      setDeleting(false);
    }
  };

  /* Close modal and reset error */
  const handleModalClose = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setModalError('');
  };

  /* Disable only for admin roles and the logged-in admin themselves */
  const isDeleteDisabled = (user) =>
    user.role === 'admin' || user._id === currentAdmin?._id;

  const deleteTooltip = (user) => {
    if (user._id === currentAdmin?._id) return 'You cannot delete your own account';
    if (user.role === 'admin') return 'Admin accounts cannot be deleted';
    return 'Delete this user';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 px-2">
        <h1 className="text-3xl font-bold text-slate-800 mb-1 border-l-4 border-brand-600 pl-4 -ml-4">
          User Management
        </h1>
        <p className="text-slate-500 text-sm">
          View and manage all registered users. Users with existing orders cannot be deleted.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500 px-1">
          <span className="font-semibold text-slate-700">{users.length}</span> users registered
          <span className="mx-2 text-slate-300">|</span>
          <span className="font-semibold text-amber-600">{users.filter((u) => u.role === 'admin').length}</span> admin(s)
          <span className="mx-2 text-slate-300">|</span>
          <span className="font-semibold text-slate-700">{users.filter((u) => u.role === 'user').length}</span> customer(s)
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const disabled = isDeleteDisabled(user);
                  return (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      {/* User info */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs border border-brand-200 shadow-sm flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-800 font-bold">{user.name}</p>
                          <p className="text-slate-400 text-xs font-mono">{user._id}</p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 font-medium text-slate-700">{user.email}</td>

                      {/* Role badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'admin'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Registered date */}
                      <td className="px-6 py-4 font-medium text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => !disabled && handleDeleteClick(user)}
                          disabled={disabled}
                          title={deleteTooltip(user)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            disabled
                              ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-sm'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal (Confirm + Error states combined) */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={handleModalClose}
          loading={deleting}
          errorMsg={modalError}
        />
      )}

      {/* Success Toast */}
      {successMsg && (
        <SuccessToast message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
    </div>
  );
};

export default ManageUsers;
