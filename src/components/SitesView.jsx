import { useState } from 'react'
import { ExternalLink, Users, Calendar, ChevronDown, ChevronUp, Plus, Link as LinkIcon } from 'lucide-react'

export default function SitesView({ sites, setSites, searchTerm }) {
  const [expandedSites, setExpandedSites] = useState({})

  const filteredSites = sites.filter(s => 
    s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSite = (siteId) => {
    setExpandedSites(prev => ({ ...prev, [siteId]: !prev[siteId] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sites SharePoint</h2>
          <p className="text-gray-600 mt-1">
            {filteredSites.length} site{filteredSites.length > 1 ? 's' : ''}
            {searchTerm && ` (filtré sur "${searchTerm}")`}
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter un site</span>
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSites.map(site => (
          <div key={site.id} className="card hover:shadow-md transition-shadow">
            {/* Site Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{site.nom}</h3>
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Créé le {site.date_creation}</span>
                  </div>
                </div>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              {/* URL */}
              <div className="flex items-center space-x-2 text-sm bg-gray-50 rounded-lg p-3">
                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 truncate"
                >
                  {site.url}
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Membres actifs</span>
                  </div>
                  <p className="text-3xl font-bold text-primary-600">{site.nombre_membres_actifs}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Total membres</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-400">{site.nombre_membres}</p>
                </div>
              </div>

              {/* Toggle Members Button */}
              <button
                onClick={() => toggleSite(site.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                <span>Voir les membres ({site.membres.length})</span>
                {expandedSites[site.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Members List */}
              {expandedSites[site.id] && (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  {/* Membres actifs */}
                  {site.membres_actifs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Membres actifs ({site.membres_actifs.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {site.membres_actifs.map((membre, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm bg-green-50 text-green-800 rounded px-3 py-2"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{membre}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tous les membres */}
                  {site.membres.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Tous les membres ({site.membres.length})
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {site.membres.map((membre, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm bg-gray-50 text-gray-700 rounded px-3 py-2"
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              site.membres_actifs.includes(membre) ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <span>{membre}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredSites.length === 0 && (
          <div className="col-span-2 card text-center py-12">
            <p className="text-gray-500">Aucun site SharePoint trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
