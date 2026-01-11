import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Mail, Key } from 'lucide-react'

export default function FormateursView({ formateurs, setFormateurs, searchTerm }) {
  const [showPassword, setShowPassword] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const filteredFormateurs = formateurs.filter(f => 
    f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.formation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startEdit = (formateur) => {
    setEditingId(formateur.id)
    setEditForm({ ...formateur })
  }

  const saveEdit = () => {
    setFormateurs(formateurs.map(f => f.id === editingId ? editForm : f))
    setEditingId(null)
    setEditForm({})
  }

  const deleteFormateur = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce formateur ?')) {
      setFormateurs(formateurs.filter(f => f.id !== id))
    }
  }

  const togglePassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const addAccess = (formateurId) => {
    const newAccess = {
      site: '',
      date_entree: '',
      date_sortie: ''
    }
    const formateur = formateurs.find(f => f.id === formateurId)
    formateur.acces_sharepoint.push(newAccess)
    setFormateurs([...formateurs])
  }

  const removeAccess = (formateurId, accessIndex) => {
    const formateur = formateurs.find(f => f.id === formateurId)
    formateur.acces_sharepoint.splice(accessIndex, 1)
    setFormateurs([...formateurs])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Formateurs</h2>
          <p className="text-gray-600 mt-1">
            {filteredFormateurs.length} formateur{filteredFormateurs.length > 1 ? 's' : ''}
            {searchTerm && ` (filtré sur "${searchTerm}")`}
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter un formateur</span>
        </button>
      </div>

      {/* Formateurs List */}
      <div className="space-y-4">
        {filteredFormateurs.map(formateur => (
          <div key={formateur.id} className="card hover:shadow-md transition-shadow">
            {/* Formateur Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{formateur.nom}</h3>
                  {formateur.formation && (
                    <span className="badge badge-info">{formateur.formation}</span>
                  )}
                  {formateur.lms_actif === 'ok' ? (
                    <span className="badge badge-success">LMS Actif</span>
                  ) : (
                    <span className="badge badge-danger">LMS Inactif</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{formateur.email}</span>
                  </div>
                  {formateur.mot_de_passe && (
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4" />
                      {showPassword[formateur.id] ? (
                        <span className="font-mono">{formateur.mot_de_passe}</span>
                      ) : (
                        <span>••••••••</span>
                      )}
                      <button
                        onClick={() => togglePassword(formateur.id)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {showPassword[formateur.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startEdit(formateur)}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteFormateur(formateur.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Accès SharePoint */}
            {formateur.acces_sharepoint.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Accès SharePoint ({formateur.acces_sharepoint.length})
                  </h4>
                  <button
                    onClick={() => addAccess(formateur.id)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Ajouter un accès
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formateur.acces_sharepoint.map((acces, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 relative group">
                      <button
                        onClick={() => removeAccess(formateur.id, index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-100 rounded p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <p className="font-medium text-gray-900 pr-8">{acces.site}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {acces.date_entree && (
                          <span>Du {acces.date_entree}</span>
                        )}
                        {acces.date_sortie && (
                          <span>au {acces.date_sortie}</span>
                        )}
                        {!acces.date_entree && !acces.date_sortie && (
                          <span className="text-gray-400">Dates non définies</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredFormateurs.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500">Aucun formateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
