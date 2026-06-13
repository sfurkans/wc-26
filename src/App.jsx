import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import NavTabs from './components/layout/NavTabs.jsx'

// Route bazlı code-splitting — her sayfa ayrı chunk, açılış hızlı
const GroupsPage = lazy(() => import('./pages/GroupsPage.jsx'))
const MatchesPage = lazy(() => import('./pages/MatchesPage.jsx'))
const StandingsPage = lazy(() => import('./pages/StandingsPage.jsx'))
const KnockoutPage = lazy(() => import('./pages/KnockoutPage.jsx'))
const StatsPage = lazy(() => import('./pages/StatsPage.jsx'))
const GeneralPage = lazy(() => import('./pages/GeneralPage.jsx'))
const AdminPage = lazy(() => import('./pages/AdminPage.jsx')) // gizli: /yonet

function RouteFallback() {
  return (
    <div className="route-loading">
      <span className="route-spinner" /> Yükleniyor…
    </div>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <NavTabs />
      <main className="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<GroupsPage />} />
            <Route path="/maclar" element={<MatchesPage />} />
            <Route path="/puan-durumu" element={<StandingsPage />} />
            <Route path="/eleme" element={<KnockoutPage />} />
            <Route path="/istatistikler" element={<StatsPage />} />
            <Route path="/genel" element={<GeneralPage />} />
            <Route path="/yonet" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  )
}
