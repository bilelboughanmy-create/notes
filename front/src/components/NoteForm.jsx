import { useState } from 'react'
import { useToast } from '../context/ToastContext'

const PRIORITIES = [
  { value: 'basse',   label: 'Basse' },
  { value: 'moyenne', label: 'Moyenne' },
  { value: 'haute',   label: 'Haute' },
]

export default function NoteForm({ initialData, onSave, onCancel }) {
  const [form, setForm]       = useState({
    title:    initialData?.title    || '',
    content:  initialData?.content  || '',
    priority: initialData?.priority || 'moyenne',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const { addToast } = useToast()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) {
      setErrors({ title: ['Le titre est obligatoire.'] })
      return
    }
    setLoading(true)
    try {
      await onSave(form)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        addToast(err.response?.data?.message || 'Une erreur est survenue.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
        {initialData ? 'Modifier la note' : 'Nouvelle note'}
      </h3>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="title" value={form.title} onChange={handleChange}
            placeholder="Titre de la note…" maxLength={100}
            className={`input-field ${errors.title ? 'border-red-400' : ''}`}
          />
          <div className="flex justify-between mt-1">
            <span className="text-red-500 text-xs">{errors.title ? errors.title[0] : ''}</span>
            <span className="text-gray-400 text-xs">{form.title.length}/100</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Contenu <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <textarea
            name="content" value={form.content} onChange={handleChange}
            placeholder="Contenu de la note…" rows={4}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Priorité</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Enregistrement…' : initialData ? 'Mettre à jour' : 'Créer la note'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        </div>
      </form>
    </div>
  )
}
