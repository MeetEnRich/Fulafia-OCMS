import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { adminAPI } from '../../services/api';
import { Card, Btn } from '../../components/UI';
import { Search, UserPlus, X, Edit3, KeyRound } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'bursary', label: 'Bursary Officer' },
  { value: 'library', label: 'Library Officer' },
  { value: 'hod', label: 'HOD' },
  { value: 'student_affairs', label: 'Student Affairs' },
  { value: 'admin', label: 'Administrator' },
];

const EMPTY_FORM = { userId: '', fullName: '', role: 'student', department: '', faculty: '', level: '', session: '2024/2025' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useApp();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setModalMode('add');
    setError('');
    setShowModal(true);
  };

  const openEdit = (user) => {
    setForm({
      userId: user.user_id,
      fullName: user.full_name,
      role: user.role,
      department: user.department || '',
      faculty: user.faculty || '',
      level: user.level || '',
      session: '',
    });
    setModalMode('edit');
    setError('');
    setShowModal(true);
  };

  const handleResetPassword = async (user) => {
    if (!confirm(`Reset password for "${user.full_name}" (${user.user_id}) to the default?\n\nNew password will be: password123`)) return;
    try {
      const res = await adminAPI.resetPassword(user.user_id);
      showToast(res.data.message, 'success', 'Password Reset');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to reset password.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (modalMode === 'add') {
        const res = await adminAPI.createUser(form);
        showToast(res.data.message, 'success', 'User Created');
      } else {
        const res = await adminAPI.updateUser(form.userId, {
          fullName: form.fullName,
          department: form.department,
          faculty: form.faculty,
          level: form.level,
        });
        showToast(res.data.message, 'success', 'User Updated');
      }
      setShowModal(false);
      setLoading(true);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed.');
    }
    setSaving(false);
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>User Management</h1>
        <Btn variant="primary" onClick={openAdd}>
          <UserPlus size={18} /> Add New User
        </Btn>
      </div>

      <Card>
        <div className="card-header">
          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search name, ID or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Info</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Department / Faculty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found.</td></tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="font-medium">{u.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined {new Date(u.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="font-medium">{u.user_id}</td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontWeight: 500, color: u.role === 'admin' ? 'var(--danger)' : u.role === 'student' ? 'var(--primary)' : 'var(--warning)' }}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div>{u.department}</div>
                      {u.faculty && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.faculty}</div>}
                    </td>
                    <td>
                      <button
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--info)', fontSize: '0.875rem', fontWeight: 500, marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius)', transition: 'background 0.2s' }}
                        onClick={() => openEdit(u)}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius)', transition: 'background 0.2s' }}
                        onClick={() => handleResetPassword(u)}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <KeyRound size={14} /> Reset Pass
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ═══ Modal ═══ */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, backdropFilter: 'blur(4px)' }}
            onClick={() => setShowModal(false)}
          />

          {/* Modal panel */}
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
            background: 'var(--surface)', borderRadius: 'var(--radius-lg, 12px)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)', zIndex: 101, padding: 0,
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {modalMode === 'add' ? 'Add New User' : 'Edit User'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', padding: '0.25rem', borderRadius: '50%', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              {error && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--danger-bg, #fef2f2)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              {/* User ID */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">User ID / Matric No.</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. 2024/CP/CSC/0001 or BURS002"
                  value={form.userId}
                  onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                  disabled={modalMode === 'edit'}
                  required
                  style={modalMode === 'edit' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>

              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  required
                />
              </div>

              {/* Role */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  disabled={modalMode === 'edit'}
                  style={modalMode === 'edit' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              {/* Department */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Department</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                  required
                />
              </div>

              {/* Student-specific fields */}
              {form.role === 'student' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Faculty</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="e.g. Computing"
                        value={form.faculty}
                        onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Level</label>
                      <select
                        className="form-input"
                        value={form.level}
                        onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                      >
                        <option value="">Select</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                      </select>
                    </div>
                  </div>

                  {modalMode === 'add' && (
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Academic Session</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="e.g. 2024/2025"
                        value={form.session}
                        onChange={e => setForm(f => ({ ...f, session: e.target.value }))}
                      />
                    </div>
                  )}
                </>
              )}

              {modalMode === 'add' && (
                <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.8125rem', color: 'var(--text-secondary)', borderLeft: '4px solid var(--primary)' }}>
                  Default password will be set to: <strong>password123</strong>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Btn variant="secondary" onClick={() => setShowModal(false)} type="button">
                  Cancel
                </Btn>
                <Btn variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </Btn>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
