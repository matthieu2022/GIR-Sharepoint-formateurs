import { Users, GraduationCap, Server, AlertCircle, Calendar, TrendingUp } from 'lucide-react'
import { format, parseISO, isAfter, isBefore, addMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Dashboard({ data }) {
  const today = new Date()
  const nextMonth = addMonths(today, 1)

  // Statistiques générales
  const stats = [
    {
      label: 'Formateurs actifs',
      value: data.formateurs.filter(f => f.lms_actif === 'ok').length,
      total: data.formateurs.length,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Apprenants',
      value: data.apprenants.length,
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Sites SharePoint',
      value: data.sites.length,
      icon: Server,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Total membres actifs',
      value: data.sites.reduce((sum, site) => sum + site.nombre_membres_actifs, 0),
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  // Accès expirant bientôt
  const expiringAccess = []
  
  data.formateurs.forEach(formateur => {
    formateur.acces_sharepoint.forEach(acces => {
      if (acces.date_sortie) {
        try {
          const sortieDate = parseISO(acces.date_sortie)
          if (isAfter(sortieDate, today) && isBefore(sortieDate, nextMonth)) {
            expiringAccess.push({
              type: 'Formateur',
              nom: formateur.nom,
              site: acces.site,
              date: acces.date_sortie,
            })
          }
        } catch (e) {
          // Ignore invalid dates
        }
      }
    })
  })

  data.apprenants.forEach(apprenant => {
    if (apprenant.date_sortie) {
      try {
        const sortieDate = parseISO(apprenant.date_sortie)
        if (isAfter(sortieDate, today) && isBefore(sortieDate, nextMonth)) {
          expiringAccess.push({
            type: 'Apprenant',
            nom: apprenant.nom_complet,
            site: apprenant.groupe,
            date: apprenant.date_sortie,
          })
        }
      } catch (e) {
        // Ignore invalid dates
      }
    }
  })

  // Répartition par groupe
  const groupes = {}
  data.apprenants.forEach(apprenant => {
    groupes[apprenant.groupe] = (groupes[apprenant.groupe] || 0) + 1
  })

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.total && (
                      <span className="text-sm text-gray-500">/ {stat.total}</span>
                    )}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Répartition par groupe */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition des apprenants par groupe</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(groupes).map(([groupe, count]) => (
            <div key={groupe} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">{groupe}</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accès expirant bientôt */}
      {expiringAccess.length > 0 && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-yellow-900">
              Accès expirant dans le mois ({expiringAccess.length})
            </h2>
          </div>
          <div className="space-y-2">
            {expiringAccess.slice(0, 10).map((access, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <span className="badge badge-warning">{access.type}</span>
                  <span className="font-medium text-gray-900">{access.nom}</span>
                  <span className="text-sm text-gray-600">→ {access.site}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{access.date}</span>
                </div>
              </div>
            ))}
            {expiringAccess.length > 10 && (
              <p className="text-sm text-gray-600 text-center pt-2">
                + {expiringAccess.length - 10} autres accès à renouveler
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sites les plus actifs */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sites SharePoint les plus actifs</h2>
        <div className="space-y-3">
          {data.sites
            .sort((a, b) => b.nombre_membres_actifs - a.nombre_membres_actifs)
            .slice(0, 5)
            .map((site) => (
              <div key={site.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{site.nom}</p>
                  <p className="text-sm text-gray-600 truncate max-w-md">{site.url}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{site.nombre_membres_actifs}</p>
                    <p className="text-xs text-gray-600">actifs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{site.nombre_membres}</p>
                    <p className="text-xs text-gray-600">total</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
