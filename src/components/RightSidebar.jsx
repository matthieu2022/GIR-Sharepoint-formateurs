import { Users, Calendar, DoorOpen, Server, Database, HardDrive, Activity, Bell, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getUsers, getSalles, getEvents, getSharePointSites, getGroupesGIR } from '../services/storage'
import { isWithinInterval, differenceInDays, parseISO } from 'date-fns'

export default function RightSidebar() {
  const [stats, setStats] = useState({
    users: 0,
    apprenants: 0,
    formateurs: 0,
    salles: 0,
    events: 0,
    sharepoint: 0,
  })

  const [dbStatus, setDbStatus] = useState({
    status: 'checking',
    database: '-',
    version: '-',
    size_mb: 0,
    tables: {
      users: 0,
      salles: 0,
      events: 0,
      sharepoint: 0,
      groupes_gir: 0
    },
    timestamp: null
  })

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Charger les stats depuis localStorage (mode local)
    const users = getUsers()
    const salles = getSalles()
    const events = getEvents()
    const sharepoint = getSharePointSites()

    const localStats = {
      users: users.length,
      apprenants: users.filter(u => u.role === 'Apprenant' && u.etat === 'Actif').length,
      formateurs: users.filter(u => u.role === 'Formateur' && u.etat === 'Actif').length,
      salles: salles.length,
      events: events.length,
      sharepoint: sharepoint.filter(s => s.etat === 'Actif').length,
    }

    setStats(localStats)

    // Charger les notifications pour les groupes GIR
    loadGroupeNotifications()
  }, [])

  const loadGroupeNotifications = () => {
    const groupes = getGroupesGIR()
    const today = new Date()
    const notifs = []

    groupes.forEach(groupe => {
      if (groupe.statut !== 'Actif') return

      // Vérifier date d'entrée
      if (groupe.dateEntree) {
        try {
          const dateEntree = parseISO(groupe.dateEntree)
          const daysUntilEntry = differenceInDays(dateEntree, today)

          // Groupe qui entre dans les 7 prochains jours
          if (daysUntilEntry > 0 && daysUntilEntry <= 7) {
            notifs.push({
              id: `entry-${groupe.id}`,
              type: 'entry',
              groupeId: groupe.id,
              groupeName: groupe.nom,
              date: groupe.dateEntree,
              daysLeft: daysUntilEntry,
              message: `Entre dans ${daysUntilEntry} jour${daysUntilEntry > 1 ? 's' : ''}`
            })
          }
        } catch (e) {
          // Date invalide, ignorer
        }
      }

      // Vérifier date de sortie
      if (groupe.dateSortie) {
        try {
          const dateSortie = parseISO(groupe.dateSortie)
          const daysUntilExit = differenceInDays(dateSortie, today)

          // Groupe qui sort dans les 14 prochains jours
          if (daysUntilExit > 0 && daysUntilExit <= 14) {
            notifs.push({
              id: `exit-${groupe.id}`,
              type: 'exit',
              groupeId: groupe.id,
              groupeName: groupe.nom,
              date: groupe.dateSortie,
              daysLeft: daysUntilExit,
              message: `Sort dans ${daysUntilExit} jour${daysUntilExit > 1 ? 's' : ''}`
            })
          }
        } catch (e) {
          // Date invalide, ignorer
        }
      }
    })

    setNotifications(notifs)
  }

  const handleNotificationClick = (groupeId) => {
    const event = new CustomEvent('navigateToGroupe', { detail: groupeId })
    window.dispatchEvent(event)
  }

  // Vérifier le statut de la BDD et mettre à jour les stats
  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        // Remplacer par votre URL API en production
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const response = await fetch(`${API_URL}/api/database/status`)
        
        if (response.ok) {
          const data = await response.json()
          setDbStatus(data)

          // Mettre à jour les statistiques avec les données de la BDD
          if (data.status === 'connected' && data.tables) {
            // Utiliser les données précises de la BDD
            setStats({
              users: data.tables.users || 0,
              apprenants: data.tables.apprenants || 0,
              formateurs: data.tables.formateurs || 0,
              salles: data.tables.salles || 0,
              events: data.tables.events || 0,
              sharepoint: data.tables.sharepoint || 0,
            })
          }
        } else {
          setDbStatus(prev => ({ ...prev, status: 'error' }))
        }
      } catch (error) {
        setDbStatus(prev => ({ ...prev, status: 'disconnected' }))
        // Garder les stats localStorage en cas d'erreur
      }
    }

    // Vérifier au chargement
    checkDatabaseStatus()

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkDatabaseStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (dbStatus.status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'error':
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const getStatusText = () => {
    switch (dbStatus.status) {
      case 'connected':
        return '✓ Connectée'
      case 'error':
        return '✗ Erreur'
      case 'disconnected':
        return '✗ Déconnectée'
      default:
        return '⟳ Vérification...'
    }
  }

  return (
    <div className="space-y-4">
      {/* Statut Base de données */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="w-4 h-4 text-primary-600" />
          <h3 className="font-semibold text-gray-900 text-sm">Base de données</h3>
        </div>
        
        <div className="space-y-3">
          {/* Badge de statut */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Statut</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {dbStatus.status === 'connected' && (
            <>
              {/* Nom de la BDD */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Nom</span>
                <span className="text-xs font-mono font-medium text-gray-900">
                  {dbStatus.database}
                </span>
              </div>

              {/* Version */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Version</span>
                <span className="text-xs font-medium text-gray-700">
                  {dbStatus.version?.split('-')[0] || '-'}
                </span>
              </div>

              {/* Taille */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 flex items-center space-x-1">
                  <HardDrive className="w-3 h-3" />
                  <span>Taille</span>
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {dbStatus.size_mb} Mo
                </span>
              </div>

              {/* Séparateur */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Enregistrements par table */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-700 mb-2">Enregistrements</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Users</span>
                  <span className="text-xs font-medium text-primary-700">
                    {dbStatus.tables.users}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Salles</span>
                  <span className="text-xs font-medium text-primary-700">
                    {dbStatus.tables.salles}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Événements</span>
                  <span className="text-xs font-medium text-primary-700">
                    {dbStatus.tables.events}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">SharePoint</span>
                  <span className="text-xs font-medium text-primary-700">
                    {dbStatus.tables.sharepoint}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Groupes GIR</span>
                  <span className="text-xs font-medium text-primary-700">
                    {dbStatus.tables.groupes_gir}
                  </span>
                </div>
              </div>

              {/* Dernière vérification */}
              {dbStatus.timestamp && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Activity className="w-3 h-3" />
                    <span>Actualisé: {new Date(dbStatus.timestamp).toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notifications Groupes GIR */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-orange-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Alertes Groupes GIR</h3>
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.groupeId)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  notif.type === 'entry'
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    notif.type === 'entry' ? 'text-blue-600' : 'text-orange-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {notif.groupeName}
                    </p>
                    <p className={`text-xs font-medium ${
                      notif.type === 'entry' ? 'text-blue-700' : 'text-orange-700'
                    }`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notif.type === 'entry' ? '📅 Entrée' : '🚪 Sortie'} : {new Date(notif.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    notif.daysLeft <= 3
                      ? 'bg-red-100 text-red-700'
                      : notif.daysLeft <= 7
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {notif.daysLeft}j
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Cliquez sur une alerte pour voir le groupe
            </p>
          </div>
        </div>
      )}

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
            ⚙️ Paramètres
          </a>
        </div>
      </div>
    </div>
  )
}
