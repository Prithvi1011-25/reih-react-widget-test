import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PackageIntegrationPage } from './pages/PackageIntegrationPage';
import { ScriptEmbedPage } from './pages/ScriptEmbedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/script-embed" element={<ScriptEmbedPage />} />
        <Route path="/package" element={<PackageIntegrationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
