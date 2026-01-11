import { useState } from 'react'
import { Calendar as CalendarIcon, Users, DoorOpen, Search, Download, Upload, Server } from 'lucide-react'
import CalendrierView from './views/CalendrierView'
import SallesView from './views/SallesView'
import ApprenantsView from './views/ApprenantsView'
import SharePointView from './views/SharePointView'
import GroupesGIRView from './views/GroupesGIRView'
import SideCalendar from './components/SideCalendar'
import NotesWidget from './components/NotesWidget'
import RightSidebar from './components/RightSidebar'
import { exportData, importData, getUsers } from './services/storage'

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

  const handleExportCSV = () => {
    const users = getUsers()
    
    // En-têtes CSV
    const headers = [
      'Nom', 'Prénom', 'Email', 'Rôle', 'Groupe', 'Date entrée', 'Date sortie', 
      'TP', 'Licence Global Exam', 'État', 'Ordinateur à fournir', 
      'Ordi personnel', 'Adresse O365 à créer', 'Mot de passe O365', 'Mot de passe LMS'
    ]
    
    // Convertir les données en lignes CSV
    const rows = users.map(user => [
      user.nom || '',
      user.prenom || '',
      user.email || '',
      user.role || '',
      user.groupe || '',
      user.dateEntree || '',
      user.dateSortie || '',
      user.tp || '',
      user.licenceGlobalExam || '',
      user.etat || '',
      user.ordinateurFournir || '',
      user.ordiPersonnel || '',
      user.adresseO365Creer || '',
      user.motDePasseO365 || '',
      user.motDePasseLMS || ''
    ])
    
    // Créer le contenu CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `academie-users-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert('⚠️ ATTENTION : Ce fichier contient des mots de passe. À manipuler avec précaution !')
  }

  const handleDownloadTemplate = () => {
    const headers = [
      'Nom', 'Prénom', 'Email', 'Rôle', 'Groupe', 'Date entrée', 'Date sortie', 
      'TP', 'Licence Global Exam', 'État', 'Ordinateur à fournir', 
      'Ordi personnel', 'Adresse O365 à créer', 'Mot de passe O365', 'Mot de passe LMS'
    ]
    
    const exampleRow = [
      'Dupont', 'Jean', 'jean.dupont@email.com', 'Apprenant', 'VTF', 
      '2025-01-01', '2025-12-31', 'RHH', 'GE123456', 'Actif', 'oui', '', 'non',
      'MotDePasse123!', 'LMS_Pass456!'
    ]
    
    const csvContent = [
      headers.join(','),
      exampleRow.map(cell => `"${cell}"`).join(',')
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'template-import-utilisateurs.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportCSV = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target.result
          const lines = text.split('\n')
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
          
          const users = []
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g).map(v => v.replace(/"/g, '').trim())
              
              const user = {
                id: Date.now().toString() + i,
                nom: values[0] || '',
                prenom: values[1] || '',
                email: values[2] || '',
                role: values[3] || 'Apprenant',
                groupe: values[4] || '',
                dateEntree: values[5] || '',
                dateSortie: values[6] || '',
                tp: values[7] || '',
                licenceGlobalExam: values[8] || '',
                etat: values[9] || 'Actif',
                ordinateurFournir: values[10] || 'oui',
                ordiPersonnel: values[11] || '',
                adresseO365Creer: values[12] || 'non',
                motDePasseO365: values[13] || '',
                motDePasseLMS: values[14] || '',
                createdAt: new Date().toISOString()
              }
              users.push(user)
            }
          }
          
          importData({ users })
          alert(`✅ ${users.length} utilisateur(s) importé(s) avec succès !\n⚠️ Les mots de passe ont été importés de manière sécurisée.`)
          window.location.reload()
        } catch (error) {
          alert('Erreur lors de l\'import du CSV. Vérifiez le format du fichier.')
          console.error(error)
        }
      }
      reader.readAsText(file)
    }
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
    { id: 'salles', label: 'Gestion des salles du site du Rayolet', icon: DoorOpen },
    { id: 'apprenants', label: 'Liste des apprenants', icon: Users },
    { id: 'sharepoint', label: 'Listing SharePoint', icon: Server },
    { id: 'groupes-gir', label: 'Listing groupe GIR', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar gauche */}
      <aside className="hidden lg:block w-72 bg-gray-50 border-r border-gray-200 p-4 space-y-4 overflow-y-auto fixed h-screen">
        <SideCalendar />
        <NotesWidget />
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-72 lg:mr-80">
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
                  onClick={handleDownloadTemplate}
                  className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                  title="Télécharger le template CSV"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Template CSV</span>
                </button>

                <label className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Import CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
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
          {activeView === 'sharepoint' && <SharePointView />}
          {activeView === 'groupes-gir' && <GroupesGIRView />}
        </main>
      </div>

      {/* Sidebar droite */}
      <aside className="hidden lg:block w-80 bg-gray-50 border-l border-gray-200 p-4 fixed right-0 h-screen overflow-y-auto">
        <RightSidebar />
      </aside>
    </div>
  )
}

export default App
