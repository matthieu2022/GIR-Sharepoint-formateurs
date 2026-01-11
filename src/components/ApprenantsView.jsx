import { useState } from 'react'
import { Filter, Calendar, Mail, Users, Plus } from 'lucide-react'

export default function ApprenantsView({ apprenants, setApprenants, searchTerm }) {
  const [selectedGroupe, setSelectedGroupe] = useState('all')

  // Get unique groupes
  const groupes = [...new Set(apprenants.map(a => a.groupe))].sort()

  const filteredApprenants = apprenants.filter(a => {
    const matchesSearch = 
      a.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.groupe.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesGroupe = selectedGroupe === 'all' || a.groupe === selectedGroupe
    
    return matchesSearch && matchesGroupe
  })

  // Group apprenants by groupe for display
  const groupedApprenants = {}
  filteredApprenants.forEach(apprenant => {
    if (!groupedApprenants[apprenant.groupe]) {
      groupedApprenants[apprenant.groupe] = []
    }
    groupedApprenants[apprenant.groupe].push(apprenant)
  })

  const getGroupeColor = (groupe) => {
    const colors = {
      'VTF': 'bg-blue-100 text-blue-800',
      'Héliades': 'bg-purple-100 text-purple-800',
      'AC': 'bg-green-100 text-green-800',
      'Belambra': 'bg-orange-100 text-orange-800',
      'ECG': 'bg-pink-100 text-pink-800',
    }
    return colors[groupe] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apprenants</h2>
            <p className="text-gray-600 mt-1">
              {filteredApprenants.length} apprenant{filteredApprenants.length > 1 ? 's' : ''}
              {searchTerm && ` (filtré sur "${searchTerm}")`}
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Ajouter un apprenant</span>
          </button>
        </div>

        {/* Groupe Filter */}
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGroupe('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGroupe === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tous les groupes
            </button>
            {groupes.map(groupe => (
              <button
                key={groupe}
                onClick={() => setSelectedGroupe(groupe)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedGroupe === groupe
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {groupe} ({apprenants.filter(a => a.groupe === groupe).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Apprenants by Group */}
      <div className="space-y-6">
        {Object.entries(groupedApprenants).map(([groupe, apprenantsInGroupe]) => (
          <div key={groupe} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{groupe}</h3>
                <span className={`badge ${getGroupeColor(groupe)}`}>
                  {apprenantsInGroupe.length} apprenant{apprenantsInGroupe.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="pb-3">Nom complet</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">SharePoint</th>
                    <th className="pb-3">Période</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {apprenantsInGroupe.map(apprenant => (
                    <tr key={apprenant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <p className="font-medium text-gray-900">{apprenant.nom_complet}</p>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{apprenant.email || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-gray-900">
                          {apprenant.sharepoint || '-'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {apprenant.date_entree && apprenant.date_sortie ? (
                              `${apprenant.date_entree} → ${apprenant.date_sortie}`
                            ) : apprenant.date_entree ? (
                              `À partir du ${apprenant.date_entree}`
                            ) : (
                              '-'
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {filteredApprenants.length === 0 && (
          <div className="card text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucun apprenant trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
