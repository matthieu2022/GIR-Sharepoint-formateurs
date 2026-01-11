import { useState, useEffect } from 'react'
import { Save, StickyNote } from 'lucide-react'
import { getNotes, saveNotes } from '../services/storage'

export default function NotesWidget() {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const notes = getNotes()
    setContent(notes.content || '')
  }, [])

  const handleSave = () => {
    setSaving(true)
    saveNotes(content)
    setTimeout(() => setSaving(false), 500)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-4 h-4 text-primary-600" />
          <h3 className="font-semibold text-gray-900 text-sm">Pense-bête</h3>
        </div>
        <button
          onClick={handleSave}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
            saving
              ? 'bg-green-100 text-green-700'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          {saving ? (
            <span className="flex items-center space-x-1">
              <span>✓</span>
              <span>Sauvegardé</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1">
              <Save className="w-3 h-3" />
              <span>Sauvegarder</span>
            </span>
          )}
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        placeholder="Notez vos idées, tâches à faire, rappels..."
      />

      <p className="text-xs text-gray-500 mt-2">
        Les notes sont automatiquement sauvegardées localement
      </p>
    </div>
  )
}
