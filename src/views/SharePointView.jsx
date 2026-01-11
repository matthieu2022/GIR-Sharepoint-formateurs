import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { getSharePointSites, createSharePointSite, updateSharePointSite, deleteSharePointSite } from '../services/storage'
import SharePointModal from '../components/SharePointModal'

export default function SharePointView() {
  const [sites, setSites] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingSite, setEditingSite] = useState(null)

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = () => {
    const data = getSharePointSites()
    setSites(data)
  }

  const handleSaveSite = (siteData) => {
    if (editingSite) {
      updateSharePointSite(editingSite.id, siteData)
    } else {
      createSharePointSite(siteData)
    }
    loadSites()
    setShowModal(false)
    setEditingSite(null)
  }

  const handleEditSite = (site) => {
    setEditingSite(site)
    setShowModal(true)
  }

  const handleDeleteSite = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site SharePoint ?')) {
      deleteSharePointSite(id)
      loadSites()
    }
  }

  const handleAddNew = () => {
    setEditingSite(null)
    setShowModal(true)
  }

  const getEtatBadge = (etat) => {
    const badges = {
      'Actif': 'badge-success',
      'En cours': 'badge-warning',
      'Suspendu': 'badge-danger',
      'Archivé': 'badge-info'
    }
    return badges[etat] || 'badge-info'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Listing SharePoint</h2>
          <p className="text-gray-600 mt-1">
            {sites.length} site{sites.length > 1 ? 's' : ''} SharePoint
          </p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter un site</span>
        </button>
      </div>

      {/* Tableau */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  État
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nom SharePoint
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  URL d'accès
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sites.map(site => (
                <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getEtatBadge(site.etat)}`}>
                      {site.etat}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{site.nom}</div>
                    {site.description && (
                      <div className="text-sm text-gray-500 mt-1">{site.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {site.url ? (
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <span className="truncate max-w-md">{site.url}</span>
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditSite(site)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sites.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    Aucun site SharePoint enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <SharePointModal
          site={editingSite}
          onClose={() => {
            setShowModal(false)
            setEditingSite(null)
          }}
          onSave={handleSaveSite}
        />
      )}
    </div>
  )
}
