import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ResultPage } from './pages/ResultPage';
import { ComparePage } from './pages/ComparePage';
import { RelocationPage } from './pages/RelocationPage';
import { CitiesPage } from './pages/CitiesPage';
import { CityDetailPage } from './pages/CityDetailPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { ReverseCalculatorPage } from './pages/ReverseCalculatorPage';
import { JobOfferPage } from './pages/JobOfferPage';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/reverse-calculator" element={<ReverseCalculatorPage />} />
            <Route path="/target-gaji" element={<ReverseCalculatorPage />} />
            <Route path="/job-offer" element={<JobOfferPage />} />
            <Route path="/tawaran-kerja" element={<JobOfferPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/relocation" element={<RelocationPage />} />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/cities/:slug" element={<CityDetailPage />} />
            <Route path="/biaya-hidup/:slug" element={<CityDetailPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
