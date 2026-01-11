import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function GroupeGIRModal({ groupe, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nom: '',
    dateEntree: '',
    dateSortie: '',
    statut: 'Actif',
  })

  useEffect(() => {
    if (groupe) {
      setFormData(groupe)
    }
  }, [groupe])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {groupe ? 'Modifier le groupe GIR' : 'Nouveau groupe GIR'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Nom du groupe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du groupe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Ex: GIR RHH5"
              />
            </div>

            {/* Date d'entrée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'entrée
              </label>
              <input
                type="date"
                name="dateEntree"
                value={formData.dateEntree}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Date de sortie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de sortie
              </label>
              <input
                type="date"
                name="dateSortie"
                value={formData.dateSortie}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                required
                className="select-field"
              >
                <option value="Actif">Actif</option>
                <option value="Suspendu">Suspendu</option>
                <option value="Supprimé">Supprimé</option>
              </select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {groupe ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
