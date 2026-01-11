import { useState } from 'react'
import { Users, GraduationCap, Server, BarChart3, Download, Upload, Search } from 'lucide-react'
import Dashboard from './components/Dashboard'
import FormateursView from './components/FormateursView'
import ApprenantsView from './components/ApprenantsView'
import SitesView from './components/SitesView'
import initialData from './data/initialData.json'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [data, setData] = useState(initialData)
  const [searchTerm, setSearchTerm] = useState('')

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sharepoint-data-${new Date().toISOString().split('T')[0]}.json`
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
          const importedData = JSON.parse(e.target.result)
          setData(importedData)
          alert('Données importées avec succès !')
        } catch (error) {
          alert('Erreur lors de l\'import des données')
        }
      }
      reader.readAsText(file)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'formateurs', label: 'Formateurs', icon: Users },
    { id: 'apprenants', label: 'Apprenants', icon: GraduationCap },
    { id: 'sites', label: 'Sites SharePoint', icon: Server },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SharePoint Manager</h1>
                <p className="text-xs text-gray-500">Académie du Tourisme</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>

              {/* Import Button */}
              <label className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium">
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

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 -mb-px mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard data={data} />
        )}
        {activeTab === 'formateurs' && (
          <FormateursView 
            formateurs={data.formateurs} 
            setFormateurs={(formateurs) => setData({...data, formateurs})}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === 'apprenants' && (
          <ApprenantsView 
            apprenants={data.apprenants} 
            setApprenants={(apprenants) => setData({...data, apprenants})}
            searchTerm={searchTerm}
          />
        )}
        {activeTab === 'sites' && (
          <SitesView 
            sites={data.sites} 
            setSites={(sites) => setData({...data, sites})}
            searchTerm={searchTerm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {new Date(data.metadata.derniere_mise_a_jour).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-sm text-gray-500">
              {data.metadata.nombre_formateurs} formateurs • {data.metadata.nombre_apprenants} apprenants • {data.metadata.nombre_sites} sites
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
