import { useState, useEffect } from 'react';
import AdminLayout, { AdminPageHeader } from '../../components/AdminLayout';
import { getUsers, updateUserRole, deleteUser } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Shield, UserCheck, User, Search } from 'lucide-react';

const ROLES = ['reader', 'author', 'admin'];

const ROLE_META = {
  reader: { label: 'Reader', color: '#7A6E5A', icon: User },
  author: { label: 'Author', color: 'var(--color-buzz-teal)', icon: UserCheck },
  admin:  { label: 'Admin',  color: 'var(--color-buzz-orange)', icon: Shield },
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editRole, setEditRole] = useState(null);

  function load() { getUsers().then(setUsers).catch(() => {}); }
  useEffect(() => { load(); }, []);

  function handleRoleChange(userId, role) {
    updateUserRole(userId, role).then(() => { setEditRole(null); load(); }).catch(() => {});
  }

  function handleDelete(userId) {
    deleteUser(userId).then(() => { setDeleteTarget(null); load(); }).catch(() => {});
  }

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Users"
        subtitle={`${users.length} registered users`}
      />

      <div style={{padding: '1.5rem 2rem'}}>
        {/* Search */}
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
          <div style={{position: 'relative'}}>
            <Search size={14} style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9C8E74'}} />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users, emails, roles..."
              className="field-input"
              style={{paddingLeft: '2.25rem', width: 300}}
            />
          </div>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#9C8E74', marginLeft: 'auto'}}>
            {filtered.length} of {users.length}
          </span>
        </div>

        {/* Role legend */}
        <div style={{display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
          {ROLES.map((role) => {
            const meta = ROLE_META[role];
            const Icon = meta.icon;
            return (
              <div key={role} style={{display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#7A6E5A', letterSpacing: '0.06em', textTransform: 'uppercase'}}>
                <Icon size={12} style={{color: meta.color}} />
                {meta.label} — {users.filter((u) => u.role === role).length}
              </div>
            );
          })}
        </div>

        {/* Users table */}
        <div style={{border: '2.5px solid var(--color-buzz-navy)', overflow: 'hidden', boxShadow: '5px 5px 0 var(--color-buzz-navy)'}}>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', minWidth: 580}}>
              <thead>
                <tr>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '0.75rem 1rem', textAlign: 'left',
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A6E5A',
                      background: '#F0EAD6', borderBottom: '2px solid var(--color-buzz-navy)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const meta = ROLE_META[u.role] || ROLE_META.reader;
                  const RoleIcon = meta.icon;
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} style={{background: i % 2 === 0 ? '#FBF6E8' : '#F5EDCC', borderBottom: '1px solid rgba(27,58,75,0.1)'}}>
                      {/* User */}
                      <td style={{padding: '0.875rem 1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                          <div style={{
                            width: 34, height: 34, flexShrink: 0, background: meta.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'white',
                          }}>
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-buzz-navy)'}}>
                              {u.username}
                              {isSelf && <span style={{marginLeft: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.08em'}}>(YOU)</span>}
                            </p>
                            {u.bio && <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#9C8E74', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180}}>{u.bio}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#7A6E5A'}}>
                        {u.email}
                      </td>

                      {/* Role */}
                      <td style={{padding: '0.875rem 1rem'}}>
                        {editRole === u.id ? (
                          <div style={{display: 'flex', gap: '0.4rem', flexWrap: 'wrap'}}>
                            {ROLES.map((role) => (
                              <button key={role} onClick={() => handleRoleChange(u.id, role)} style={{
                                padding: '0.3rem 0.6rem',
                                fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
                                letterSpacing: '0.06em', textTransform: 'uppercase',
                                border: `2px solid ${ROLE_META[role].color}`,
                                background: u.role === role ? ROLE_META[role].color : 'transparent',
                                color: u.role === role ? 'white' : ROLE_META[role].color,
                                cursor: 'pointer', transition: 'all 0.12s',
                              }}>
                                {role}
                              </button>
                            ))}
                            <button onClick={() => setEditRole(null)} style={{padding: '0.3rem 0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#9C8E74', border: '1.5px solid #C9BEA0', background: 'transparent', cursor: 'pointer'}}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => !isSelf && setEditRole(u.id)} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            background: 'transparent', border: 'none', cursor: isSelf ? 'default' : 'pointer', padding: 0,
                          }}>
                            <RoleIcon size={13} style={{color: meta.color}} />
                            <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: meta.color}}>
                              {meta.label}
                            </span>
                            {!isSelf && <span style={{fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#9C8E74', marginLeft: 2}}>▼</span>}
                          </button>
                        )}
                      </td>

                      {/* Joined */}
                      <td style={{padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#7A6E5A', whiteSpace: 'nowrap'}}>
                        {u.joinDate}
                      </td>

                      {/* Actions */}
                      <td style={{padding: '0.875rem 1rem'}}>
                        {!isSelf && (
                          <button onClick={() => setDeleteTarget(u)} title="Delete user" style={{
                            display: 'inline-flex', padding: '0.35rem', border: '1.5px solid #DC2626', color: '#DC2626',
                            background: 'transparent', cursor: 'pointer',
                          }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(27,58,75,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'}}>
          <div style={{background: '#FBF6E8', border: '3px solid var(--color-buzz-navy)', boxShadow: '6px 6px 0 var(--color-buzz-red)', padding: '2rem', maxWidth: 400, width: '100%'}}>
            <h2 style={{fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem'}}>DELETE USER?</h2>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A6E5A', marginBottom: '0.5rem'}}>
              This will permanently remove:
            </p>
            <div style={{background: '#F0EAD6', border: '1.5px solid #C9BEA0', padding: '0.75rem', marginBottom: '1.25rem'}}>
              <p style={{fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-buzz-navy)'}}>{deleteTarget.username}</p>
              <p style={{fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#7A6E5A'}}>{deleteTarget.email}</p>
            </div>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#9C8E74', marginBottom: '1.5rem'}}>Their comments will remain but be attributed to their username. This cannot be undone.</p>
            <div style={{display: 'flex', gap: '0.875rem'}}>
              <button onClick={() => handleDelete(deleteTarget.id)} style={{flex: 1, padding: '0.7rem', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', background: '#DC2626', color: 'white', border: '2.5px solid #991B1B', boxShadow: '3px 3px 0 #991B1B', cursor: 'pointer'}}>
                DELETE
              </button>
              <button onClick={() => setDeleteTarget(null)} style={{flex: 1, padding: '0.7rem', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.06em', background: '#FBF6E8', color: 'var(--color-buzz-navy)', border: '2.5px solid var(--color-buzz-navy)', boxShadow: '3px 3px 0 var(--color-buzz-navy)', cursor: 'pointer'}}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
