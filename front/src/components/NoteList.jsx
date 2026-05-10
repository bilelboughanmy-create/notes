import NoteItem from './NoteItem'

export default function NoteList({ notes, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {notes.map(note => (
        <NoteItem key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
