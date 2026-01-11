import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'Apprenant',
    groupe: '',
    dateEntree: '',
    dateSortie: '',
    tp: '',
    licenceGlobalExam: '',
    etat: 'Actif',
    ordinateurFournir: 'oui',
    ordiPersonnel: '',
    adresseO365Creer: 'non',
  })

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Options des listes déroulantes
  // Ces listes seront fournies par l'utilisateur plus tard
  const groupesOptions = [
    'VTF',
    'Héliades',
    'AC',
    'Belambra',
    'ECG',
    'Groupe 1',
    'Groupe 2',
    'Groupe 3',
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Dupont"
              />
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Jean"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="jean.dupont@email.com"
              />
            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="select-field"
              >
                <option value="Apprenant">Apprenant</option>
                <option value="Formateur">Formateur</option>
              </select>
            </div>

            {/* Groupe d'appartenance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Groupe d'appartenance
              </label>
              <select
                name="groupe"
                value={formData.groupe}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Sélectionner un groupe</option>
                {groupesOptions.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* TP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TP (Type de Parcours)
              </label>
              <select
                name="tp"
                value={formData.tp}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Sélectionner un TP</option>
                <option value="RHH">RHH</option>
                <option value="RET">RET</option>
                <option value="ALT">ALT</option>
                <option value="GH">GH</option>
              </select>
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

            {/* Licence Global Exam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Licence Global Exam
              </label>
              <input
                type="text"
                name="licenceGlobalExam"
                value={formData.licenceGlobalExam}
                onChange={handleChange}
                className="input-field"
                placeholder="Numéro de licence"
              />
            </div>

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
                <option value="Suspendu">Suspendu</option>
                <option value="Supprimé">Supprimé</option>
              </select>
            </div>

            {/* Ordinateur à fournir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordinateur à fournir
              </label>
              <select
                name="ordinateurFournir"
                value={formData.ordinateurFournir}
                onChange={handleChange}
                className="select-field"
              >
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>

            {/* Ordinateur personnel (si non) */}
            {formData.ordinateurFournir === 'non' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordinateur personnel
                </label>
                <select
                  name="ordiPersonnel"
                  value={formData.ordiPersonnel}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="MAC">MAC</option>
                  <option value="PC">PC</option>
                  <option value="Chromebook">Chromebook</option>
                  <option value="Autres">Autres</option>
                </select>
              </div>
            )}

            {/* Adresse Office 365 à créer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Office 365 à créer
              </label>
              <select
                name="adresseO365Creer"
                value={formData.adresseO365Creer}
                onChange={handleChange}
                className="select-field"
              >
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
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
              {user ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
