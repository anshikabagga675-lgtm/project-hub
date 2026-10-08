import { useState } from 'react'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="workspace">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
