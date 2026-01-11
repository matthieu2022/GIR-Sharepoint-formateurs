import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react'
import { getGroupesGIR, createGroupeGIR, updateGroupeGIR, deleteGroupeGIR } from '../services/storage'
import GroupeGIRModal from '../components/GroupeGIRModal'

export default function GroupesGIRView() {
  const [groupes, setGroupes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingGroupe, setEditingGroupe] = useState(null)

  useEffect(() => {
    loadGroupes()
  }, [])

  const loadGroupes = () => {
    const data = getGroupesGIR()
    setGroupes(data)
  }

  const handleSaveGroupe = (groupeData) => {
    if (editingGroupe) {
      updateGroupeGIR(editingGroupe.id, groupeData)
    } else {
      createGroupeGIR(groupeData)
    }
    loadGroupes()
    setShowModal(false)
    setEditingGroupe(null)
  }

  const handleEditGroupe = (groupe) => {
    setEditingGroupe(groupe)
    setShowModal(true)
  }

  const handleDeleteGroupe = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe GIR ?')) {
      deleteGroupeGIR(id)
      loadGroupes()
    }
  }

  const handleAddNew = () => {
    setEditingGroupe(null)
    setShowModal(true)
  }

  const getStatutBadge = (statut) => {
    const badges = {
      'Actif': 'badge-success',
      'Suspendu': 'badge-warning',
      'Supprimé': 'badge-danger'
    }
    return badges[statut] || 'badge-info'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Listing groupe GIR</h2>
          <p className="text-gray-600 mt-1">
            {groupes.length} groupe{groupes.length > 1 ? 's' : ''} GIR
          </p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter un groupe</span>
        </button>
      </div>

      {/* Tableau */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nom du groupe
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date d'entrée
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date de sortie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groupes.map(groupe => (
                <tr 
                  key={groupe.id} 
                  id={`groupe-${groupe.id}`}
                  className="hover:bg-gray-50 transition-colors scroll-mt-20"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{groupe.nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{groupe.dateEntree || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{groupe.dateSortie || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatutBadge(groupe.statut)}`}>
                      {groupe.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditGroupe(groupe)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroupe(groupe.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {groupes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Aucun groupe GIR enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <GroupeGIRModal
          groupe={editingGroupe}
          onClose={() => {
            setShowModal(false)
            setEditingGroupe(null)
          }}
          onSave={handleSaveGroupe}
        />
      )}
    </div>
  )
}
