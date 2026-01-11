import { useState } from 'react'
import { Calendar as CalendarIcon, Users, DoorOpen, Search, Download, Upload } from 'lucide-react'
import CalendrierView from './views/CalendrierView'
import SallesView from './views/SallesView'
import ApprenantsView from './views/ApprenantsView'
import { exportData, importData } from './services/storage'

function App() {
  const [activeView, setActiveView] = useState('apprenants')

  const handleExport = () => {
    const data = exportData()
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `academie-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          importData(data)
          alert('Données importées avec succès !')
          window.location.reload()
        } catch (error) {
          alert('Erreur lors de l\'import des données')
        }
      }
      reader.readAsText(file)
    }
  }

  const navItems = [
    { id: 'calendrier', label: 'Calendrier', icon: CalendarIcon },
    { id: 'salles', label: 'Gestion des salles', icon: DoorOpen },
    { id: 'apprenants', label: 'Liste des apprenants', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec logo */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone logo */}
            <div className="flex items-center space-x-4">
              <div className="w-48 h-12 bg-primary-500 rounded-lg flex items-center justify-center px-4">
                <span className="text-white font-bold text-lg">ACADÉMIE DU TOURISME</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>

              <label className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer text-sm font-medium">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Importer</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1 -mb-px">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeView === item.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'calendrier' && <CalendrierView />}
        {activeView === 'salles' && <SallesView />}
        {activeView === 'apprenants' && <ApprenantsView />}
      </main>
    </div>
  )
}

export default App
