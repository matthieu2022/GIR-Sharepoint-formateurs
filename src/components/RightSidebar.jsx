import { Users, Calendar, DoorOpen, Server } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getUsers, getSalles, getEvents, getSharePointSites } from '../services/storage'

export default function RightSidebar() {
  const [stats, setStats] = useState({
    users: 0,
    apprenants: 0,
    formateurs: 0,
    salles: 0,
    events: 0,
    sharepoint: 0,
  })

  useEffect(() => {
    const users = getUsers()
    const salles = getSalles()
    const events = getEvents()
    const sharepoint = getSharePointSites()

    setStats({
      users: users.length,
      apprenants: users.filter(u => u.role === 'Apprenant' && u.etat === 'Actif').length,
      formateurs: users.filter(u => u.role === 'Formateur' && u.etat === 'Actif').length,
      salles: salles.length,
      events: events.length,
      sharepoint: sharepoint.filter(s => s.etat === 'Actif').length,
    })
  }, [])

  return (
    <div className="space-y-4">
      {/* Statistiques rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Statistiques</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-gray-700">Apprenants actifs</span>
            </div>
            <span className="text-sm font-bold text-primary-600">{stats.apprenants}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Formateurs actifs</span>
            </div>
            <span className="text-sm font-bold text-green-600">{stats.formateurs}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DoorOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-700">Salles</span>
            </div>
            <span className="text-sm font-bold text-purple-600">{stats.salles}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-700">Événements</span>
            </div>
            <span className="text-sm font-bold text-orange-600">{stats.events}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Sites SharePoint</span>
            </div>
            <span className="text-sm font-bold text-blue-600">{stats.sharepoint}</span>
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Accès rapides</h3>
        <div className="space-y-2">
          <a
            href="#"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
          >
            📊 Rapports
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
          >
            📧 Messagerie
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
          >
            📁 Documents
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
          >
            ⚙️ Paramètres
          </a>
        </div>
      </div>
    </div>
  )
}
