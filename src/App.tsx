import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { SpreadsheetProvider } from './context/SpreadsheetContext';
import { AppShell } from './components/layout/AppShell';

// Workflow Pages
import { ProjectListPage } from './pages/ProjectListPage';
import { MapsPage } from './pages/MapsPage';
import { IndexPage } from './pages/IndexPage';
import { DataMasterPage } from './pages/DataMasterPage';
import { ServicesMethodsPage } from './pages/ServicesMethodsPage';
import { DataValuationPage } from './pages/DataValuationPage';
import { CalculationPage } from './pages/CalculationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReviewReportPage } from './pages/ReviewReportPage';
import { ReportPrintView } from './pages/ReportPrintView';

export const App: React.FC = () => {
  return (
    <ProjectProvider>
      <SpreadsheetProvider>
        <BrowserRouter>
          <Routes>
            {/* Root redirect to 01 Projects */}
            <Route path="/" element={<Navigate to="/projects" replace />} />

            {/* Standalone Project List (01 Proyek) */}
            <Route element={<AppShell />}>
              <Route path="/projects" element={<ProjectListPage />} />
              <Route path="/projects/new" element={<ProjectListPage />} />

              {/* 9-Step Researcher Workflow */}
              <Route path="/projects/:projectId" element={<Navigate to="maps" replace />} />
              <Route path="/projects/:projectId/maps" element={<MapsPage />} />
              <Route path="/projects/:projectId/index" element={<IndexPage />} />
              <Route path="/projects/:projectId/data-master" element={<DataMasterPage />} />
              <Route path="/projects/:projectId/services-methods" element={<ServicesMethodsPage />} />
              <Route path="/projects/:projectId/jasa-method" element={<ServicesMethodsPage />} />
              <Route path="/projects/:projectId/valuation-method" element={<Navigate to="../services-methods" replace />} />
              <Route path="/projects/:projectId/identification" element={<Navigate to="../services-methods" replace />} />
              <Route path="/projects/:projectId/valuation-data" element={<DataValuationPage />} />
              <Route path="/projects/:projectId/data-valuasi" element={<DataValuationPage />} />
              <Route path="/projects/:projectId/input-data" element={<Navigate to="../valuation-data" replace />} />
              <Route path="/projects/:projectId/input" element={<Navigate to="../valuation-data" replace />} />
              <Route path="/projects/:projectId/calculation" element={<CalculationPage />} />
              <Route path="/projects/:projectId/perhitungan" element={<CalculationPage />} />
              <Route path="/projects/:projectId/analytics" element={<AnalyticsPage />} />
              <Route path="/projects/:projectId/analitik" element={<AnalyticsPage />} />
              <Route path="/projects/:projectId/review" element={<ReviewReportPage />} />
              <Route path="/projects/:projectId/review-laporan" element={<ReviewReportPage />} />
            </Route>

            {/* Dedicated Standalone Print/PDF View */}
            <Route path="/projects/:projectId/review/preview" element={<ReportPrintView />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </BrowserRouter>
      </SpreadsheetProvider>
    </ProjectProvider>
  );
};

export default App;
