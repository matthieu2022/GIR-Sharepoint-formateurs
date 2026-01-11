import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function EventModal({ date, users, salles, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    timeStart: '09:00',
    timeEnd: '12:00',
    type: 'cours',
    salle: '',
    formateur: '',
    groupe: '',
    description: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formateurs = users.filter(u => u.role === 'Formateur')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Nouvel événement
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
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Ex: Cours de Marketing"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="select-field"
                >
                  <option value="cours">Cours</option>
                  <option value="examen">Examen</option>
                  <option value="evenement">Événement</option>
                </select>
              </div>

              {/* Heure début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  name="timeStart"
                  value={formData.timeStart}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Heure fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  name="timeEnd"
                  value={formData.timeEnd}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Salle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salle
                </label>
                <select
                  name="salle"
                  value={formData.salle}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Sélectionner une salle</option>
                  {salles.map(salle => (
                    <option key={salle.id} value={salle.nom}>
                      {salle.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Formateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formateur
                </label>
                <select
                  name="formateur"
                  value={formData.formateur}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Sélectionner un formateur</option>
                  {formateurs.map(formateur => (
                    <option key={formateur.id} value={`${formateur.prenom} ${formateur.nom}`}>
                      {formateur.prenom} {formateur.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Groupe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Groupe
              </label>
              <input
                type="text"
                name="groupe"
                value={formData.groupe}
                onChange={handleChange}
                className="input-field"
                placeholder="Ex: RHH AC1 24/25"
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
                placeholder="Détails supplémentaires..."
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
              Créer l'événement
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
