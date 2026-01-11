import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function SharePointModal({ site, onClose, onSave }) {
  const [formData, setFormData] = useState({
    etat: 'Actif',
    nom: '',
    url: '',
    description: '',
  })

  useEffect(() => {
    if (site) {
      setFormData(site)
    }
  }, [site])

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
            {site ? 'Modifier le site SharePoint' : 'Nouveau site SharePoint'}
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
            {/* État */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                État <span className="text-red-500">*</span>
              </label>
              <select
                name="etat"
                value={formData.etat}
                onChange={handleChange}
                required
                className="select-field"
              >
                <option value="Actif">Actif</option>
                <option value="En cours">En cours</option>
                <option value="Suspendu">Suspendu</option>
                <option value="Archivé">Archivé</option>
              </select>
            </div>

            {/* Nom SharePoint */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom SharePoint <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Ex: SH | ALT VTF"
              />
            </div>

            {/* URL d'accès */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL d'accès
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
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
              {site ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
