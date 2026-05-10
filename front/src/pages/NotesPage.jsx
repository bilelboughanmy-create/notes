import { useState, useEffect, useCallback } from 'react'
import { useNavigate }       from 'react-router-dom'
import { useAuth }           from '../context/AuthContext'
import { useToast }          from '../context/ToastContext'
import { notesApi, authApi } from '../api/notes'
import NoteList              from '../components/NoteList'
import NoteForm              from '../components/NoteForm'
import FilterBar             from '../components/FilterBar'

export default function NotesPage() {
  const [notes, setNotes]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [editingNote, setEditing] = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')

  const { user, clearAuth } = useAuth()
  const { addToast }        = useToast()
  const navigate            = useNavigate()

  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await notesApi.getAll()
      setNotes(data)
    } catch {
      addToast('Impossible de charger les notes.', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  const handleSave = async (formData) => {
    if (editingNote) {
      const { data } = await notesApi.update(editingNote.id, formData)
      setNotes(prev => prev.map(n => n.id === editingNote.id ? data.note : n))
      addToast('Note mise à jour avec succès.')
    } else {
      const { data } = await notesApi.create(formData)
      setNotes(prev => [data.note, ...prev])
      addToast('Note créée avec succès.')
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    await notesApi.remove(id)
    setNotes(prev => prev.filter(n => n.id !== id))
    addToast('Note supprimée.')
  }

  const handleEdit = (note) => { setEditing(note); setShowForm(true) }
  const handleNew  = ()     => { setEditing(null);  setShowForm(true) }
  const handleCancel = ()   => { setShowForm(false); setEditing(null) }

  const filteredNotes = notes
    .filter(n => filter === 'all' || n.priority === filter)
    .filter(n =>
      search === '' ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
    )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Notes Personnelles
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.name}</span>
            <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
          <button onClick={handleNew} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            Nouvelle note
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="mb-6 animate-fade-slide">
            <NoteForm initialData={editingNote} onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}

        {/* Filtres + recherche (BONUS) */}
        <FilterBar filter={filter} onFilterChange={setFilter} search={search} onSearchChange={setSearch} />

        {/* Liste */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-2">
              {notes.length === 0 ? "Aucune note pour l'instant." : 'Aucune note ne correspond à votre filtre.'}
            </p>
            {notes.length === 0 && (
              <button onClick={handleNew} className="btn-secondary mt-2">Créer ma première note</button>
            )}
          </div>
        ) : (
          <NoteList notes={filteredNotes} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>
    </div>
  )
}
