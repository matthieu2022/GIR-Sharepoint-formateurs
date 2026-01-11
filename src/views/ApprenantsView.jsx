import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit2, Trash2, Mail, Calendar, Eye, EyeOff } from 'lucide-react'
import { getUsers, createUser, updateUser, deleteUser } from '../services/storage'
import UserModal from '../components/UserModal'

export default function ApprenantsView() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterGroupe, setFilterGroupe] = useState('all')
  const [filterTP, setFilterTP] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, searchTerm, filterRole, filterGroupe, filterTP])

  const loadUsers = () => {
    const data = getUsers()
    setUsers(data)
  }

  const applyFilters = () => {
    let filtered = [...users]

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(
        u =>
          u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre rôle
    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole)
    }

    // Filtre groupe
    if (filterGroupe !== 'all') {
      filtered = filtered.filter(u => u.groupe === filterGroupe)
    }

    // Filtre TP
    if (filterTP !== 'all') {
      filtered = filtered.filter(u => u.tp === filterTP)
    }

    setFilteredUsers(filtered)
  }

  const handleSaveUser = (userData) => {
    if (editingUser) {
      updateUser(editingUser.id, userData)
    } else {
      createUser(userData)
    }
    loadUsers()
    setShowModal(false)
    setEditingUser(null)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDeleteUser = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(id)
      loadUsers()
    }
  }

  const handleAddNew = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  // Grouper par rôle pour l'affichage Kanban
  const apprenants = filteredUsers.filter(u => u.role === 'Apprenant')
  const formateurs = filteredUsers.filter(u => u.role === 'Formateur')

  // Obtenir les groupes et TP uniques pour les filtres
  const groupes = [...new Set(users.map(u => u.groupe).filter(Boolean))]
  const tps = [...new Set(users.map(u => u.tp).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* Header avec recherche et filtres */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Liste des utilisateurs</h2>
            <p className="text-gray-600 mt-1">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={handleAddNew} className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Ajouter un utilisateur</span>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtres :</span>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="select-field text-sm"
          >
            <option value="all">Tous les rôles</option>
            <option value="Apprenant">Apprenants</option>
            <option value="Formateur">Formateurs</option>
          </select>

          <select
            value={filterGroupe}
            onChange={(e) => setFilterGroupe(e.target.value)}
            className="select-field text-sm"
          >
            <option value="all">Tous les groupes</option>
            {groupes.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={filterTP}
            onChange={(e) => setFilterTP(e.target.value)}
            className="select-field text-sm"
          >
            <option value="all">Tous les TP</option>
            {tps.map(tp => (
              <option key={tp} value={tp}>{tp}</option>
            ))}
          </select>

          {(searchTerm || filterRole !== 'all' || filterGroupe !== 'all' || filterTP !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterRole('all')
                setFilterGroupe('all')
                setFilterTP('all')
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Vue Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne Apprenants */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              <span>Apprenants</span>
              <span className="bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-bold">
                {apprenants.length}
              </span>
            </h3>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
            {apprenants.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
            {apprenants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun apprenant trouvé
              </div>
            )}
          </div>
        </div>

        {/* Colonne Formateurs */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              <span>Formateurs</span>
              <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                {formateurs.length}
              </span>
            </h3>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
            {formateurs.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
            {formateurs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun formateur trouvé
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowModal(false)
            setEditingUser(null)
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
}

// Composant Card pour affichage Kanban
function UserCard({ user, onEdit, onDelete }) {
  const [showO365Password, setShowO365Password] = useState(false)
  const [showLMSPassword, setShowLMSPassword] = useState(false)

  return (
    <div className="kanban-card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {user.prenom} {user.nom}
          </h4>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <Mail className="w-3 h-3" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(user)}
            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {user.groupe && (
            <span className="badge badge-primary">{user.groupe}</span>
          )}
          {user.tp && (
            <span className="badge badge-info">{user.tp}</span>
          )}
          {user.etat && user.etat !== 'Actif' && (
            <span className={`badge ${
              user.etat === 'Suspendu' ? 'badge-warning' : 'badge-danger'
            }`}>
              {user.etat}
            </span>
          )}
        </div>

        {(user.dateEntree || user.dateSortie) && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>
              {user.dateEntree && `Du ${user.dateEntree}`}
              {user.dateSortie && ` au ${user.dateSortie}`}
            </span>
          </div>
        )}

        {/* Mots de passe - Informations sensibles */}
        {(user.motDePasseO365 || user.motDePasseLMS) && (
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
            {user.motDePasseO365 && (
              <div className="flex items-center justify-between text-xs bg-yellow-50 px-2 py-1 rounded">
                <span className="text-gray-700">MdP O365:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-gray-900">
                    {showO365Password ? user.motDePasseO365 : '••••••••'}
                  </span>
                  <button
                    onClick={() => setShowO365Password(!showO365Password)}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    {showO365Password ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
            {user.motDePasseLMS && (
              <div className="flex items-center justify-between text-xs bg-yellow-50 px-2 py-1 rounded">
                <span className="text-gray-700">MdP LMS:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-gray-900">
                    {showLMSPassword ? user.motDePasseLMS : '••••••••'}
                  </span>
                  <button
                    onClick={() => setShowLMSPassword(!showLMSPassword)}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    {showLMSPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
