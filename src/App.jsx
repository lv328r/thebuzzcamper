import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';

import Home from './pages/Home';
import Journal from './pages/Journal';
import Reviews from './pages/Reviews';
import Upgrades from './pages/Upgrades';
import Resources from './pages/Resources';
import About from './pages/About';
import WorkWithUs from './pages/WorkWithUs';
import ReviewPolicy from './pages/ReviewPolicy';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticlePage from './pages/ArticlePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminArticles from './pages/admin/AdminArticles';
import AdminComments from './pages/admin/AdminComments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPostEditor from './pages/admin/AdminPostEditor';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAIWriter from './pages/admin/AdminAIWriter';
import AdminScheduled from './pages/admin/AdminScheduled';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-buzz-cream)'}}>
      <Nav />
      <main style={{flex: 1}}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journals/:slug" element={<ArticlePage />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:slug" element={<ArticlePage />} />
          <Route path="/upgrades" element={<Upgrades />} />
          <Route path="/upgrades/:slug" element={<ArticlePage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/work-with-us" element={<WorkWithUs />} />
          <Route path="/review-policy" element={<ReviewPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin — full page, no public Nav/Footer wrapping needed (AdminLayout handles it) */}
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/articles" element={<RequireAdmin><AdminArticles /></RequireAdmin>} />
          <Route path="/admin/comments" element={<RequireAdmin><AdminComments /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/admin/new" element={<RequireAuth><AdminPostEditor /></RequireAuth>} />
          <Route path="/admin/edit/:slug" element={<RequireAuth><AdminPostEditor /></RequireAuth>} />
          <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
          <Route path="/admin/ai-write" element={<RequireAdmin><AdminAIWriter /></RequireAdmin>} />
          <Route path="/admin/scheduled" element={<RequireAdmin><AdminScheduled /></RequireAdmin>} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{maxWidth: 480, margin: '0 auto', padding: '6rem 1.5rem', textAlign: 'center'}}>
              <div style={{fontFamily: 'var(--font-display)', fontSize: '8rem', color: 'var(--color-buzz-orange)', letterSpacing: '0.04em', lineHeight: 0.9, textShadow: '6px 6px 0 var(--color-buzz-navy)'}}>404</div>
              <h1 style={{fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-buzz-navy)', letterSpacing: '0.04em', marginBottom: '0.75rem', marginTop: '1rem'}}>PAGE NOT FOUND</h1>
              <p style={{fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#7A6E5A', marginBottom: '2rem'}}>Looks like that trail doesn&apos;t exist. Maybe the GPS lost signal?</p>
              <a href="/" className="btn-retro" style={{display: 'inline-flex'}}>Back to Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
