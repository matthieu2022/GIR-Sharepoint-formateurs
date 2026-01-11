import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, DoorOpen, Users } from 'lucide-react'
import { getSalles, createSalle, updateSalle, deleteSalle } from '../services/storage'
import SalleModal from '../components/SalleModal'

export default function SallesView() {
  const [salles, setSallesState] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingSalle, setEditingSalle] = useState(null)

  useEffect(() => {
    loadSalles()
  }, [])

  const loadSalles = () => {
    const data = getSalles()
    setSallesState(data)
  }

  const handleSaveSalle = (salleData) => {
    if (editingSalle) {
      updateSalle(editingSalle.id, salleData)
    } else {
      createSalle(salleData)
    }
    loadSalles()
    setShowModal(false)
    setEditingSalle(null)
  }

  const handleEditSalle = (salle) => {
    setEditingSalle(salle)
    setShowModal(true)
  }

  const handleDeleteSalle = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      deleteSalle(id)
      loadSalles()
    }
  }

  const handleAddNew = () => {
    setEditingSalle(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des salles du site du Rayolet</h2>
          <p className="text-gray-600 mt-1">
            {salles.length} salle{salles.length > 1 ? 's' : ''} disponible{salles.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter une salle</span>
        </button>
      </div>

      {/* Grille des salles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salles.map(salle => (
          <div key={salle.id} className="card group hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <DoorOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{salle.nom}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{salle.capacite} places</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditSalle(salle)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSalle(salle.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {salle.equipement && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Équipement</p>
                <p className="text-sm text-gray-600">{salle.equipement}</p>
              </div>
            )}

            {salle.description && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">{salle.description}</p>
              </div>
            )}
          </div>
        ))}

        {salles.length === 0 && (
          <div className="col-span-3 card text-center py-12">
            <DoorOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune salle enregistrée</p>
            <button
              onClick={handleAddNew}
              className="mt-4 btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter la première salle</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <SalleModal
          salle={editingSalle}
          onClose={() => {
            setShowModal(false)
            setEditingSalle(null)
          }}
          onSave={handleSaveSalle}
        />
      )}
    </div>
  )
}
