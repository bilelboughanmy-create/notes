import { useState } from 'react'
import { useToast } from '../context/ToastContext'

const PRIORITY_CONFIG = {
  basse:   { label: 'Basse',   bg: 'bg-green-100',  text: 'text-green-700'  },
  moyenne: { label: 'Moyenne', bg: 'bg-orange-100', text: 'text-orange-700' },
  haute:   { label: 'Haute',   bg: 'bg-red-100',    text: 'text-red-700'    },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function NoteItem({ note, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const { addToast } = useToast()

  const prio = PRIORITY_CONFIG[note.priority] || PRIORITY_CONFIG.moyenne

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await onDelete(note.id)
    } catch {
      addToast('Erreur lors de la suppression.', 'error')
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="card p-5 animate-fade-slide hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug flex-1">{note.title}</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${prio.bg} ${prio.text}`}>
          {prio.label}
        </span>
      </div>

      {note.content && (
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">{note.content}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formatDate(note.created_at)}</span>

        {!confirming ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(note)}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Modifier
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Supprimer
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-fade-slide">
            <span className="text-xs text-gray-500">Confirmer ?</span>
            <button onClick={handleDeleteConfirm} disabled={deleting} className="btn-danger text-xs py-1.5 px-3">
              {deleting ? '…' : 'Oui'}
            </button>
            <button onClick={() => setConfirming(false)} className="btn-secondary text-xs py-1.5 px-3">
              Non
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
