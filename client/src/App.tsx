import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore.js';
import { ManuscriptOpeningPage } from './pages/ManuscriptOpeningPage.js';
import { AppShell } from './layouts/AppShell.js';
import { MyWorldPage } from './pages/MyWorldPage.js';
import { MyMemoriesPage } from './pages/MyMemoriesPage.js';
import { CreateMemoryPage } from './pages/CreateMemoryPage.js';
import { HowIFeltPage } from './pages/HowIFeltPage.js';
import { AboutMePage } from './pages/AboutMePage.js';
import { AuthPage } from './pages/AuthPage.js';

export function App() {
  const { checkAuth, isUnlocked, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isUnlocked && user) {
    return <AuthPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ManuscriptOpeningPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AppShell />}>
          <Route path="/my-world" element={<MyWorldPage />} />
          <Route path="/my-memories" element={<MyMemoriesPage />} />
          <Route path="/remember-this" element={<CreateMemoryPage />} />
          <Route path="/how-i-felt" element={<HowIFeltPage />} />
          <Route path="/about-me" element={<AboutMePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
