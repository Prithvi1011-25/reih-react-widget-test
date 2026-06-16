import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

const ScriptEmbedPage = lazy(() =>
  import('./pages/ScriptEmbedPage').then((m) => ({ default: m.ScriptEmbedPage })),
);
const PackageIntegrationPage = lazy(() =>
  import('./pages/PackageIntegrationPage').then((m) => ({
    default: m.PackageIntegrationPage,
  })),
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/script-embed" element={<ScriptEmbedPage />} />
          <Route path="/package" element={<PackageIntegrationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
