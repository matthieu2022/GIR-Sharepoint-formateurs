import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function SalleModal({ salle, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nom: '',
    capacite: '',
    equipement: '',
    description: '',
  })

  useEffect(() => {
    if (salle) {
      setFormData(salle)
    }
  }, [salle])

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
            {salle ? 'Modifier la salle' : 'Nouvelle salle'}
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
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la salle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Salle 1, Amphithéâtre..."
              />
            </div>

            {/* Capacité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacité (nombre de places) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacite"
                value={formData.capacite}
                onChange={handleChange}
                required
                min="1"
                className="input-field"
                placeholder="20"
              />
            </div>

            {/* Équipement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipement
              </label>
              <input
                type="text"
                name="equipement"
                value={formData.equipement}
                onChange={handleChange}
                className="input-field"
                placeholder="Vidéoprojecteur, Ordinateurs..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input-field resize-none"
                placeholder="Informations complémentaires..."
              />
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
              {salle ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
