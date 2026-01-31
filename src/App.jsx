import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePreferences } from './hooks/usePreferences';
import { PreferencesProvider } from './context/PreferencesContext';
import { SelectedLocationProvider } from './context/SelectedLocationContext';
import { Layout } from './components/layout/layout.jsx';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';

function AppContent() {
  const { isLoaded } = usePreferences();

  // Don't render until preferences are loaded to avoid flash of wrong theme
  if (!isLoaded) {
    return null;
  }

  return (
    <SelectedLocationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SelectedLocationProvider>
  );
}

function App() {
  return (
    <PreferencesProvider>
      <AppContent />
    </PreferencesProvider>
  );
}

export default App;
