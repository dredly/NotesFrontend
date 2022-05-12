import { useState } from 'react'

const NoteForm = ({ createNote }) => {
	const [newNote, setNewNote] = useState('')

	const handleChange = evt => {
		setNewNote(evt.target.value)
	}

	const addNote = evt => {
		evt.preventDefault()
		createNote({
			content: newNote,
			important: false
		})
		setNewNote('')
	}

	return (
		<div>
			<h2>Create a new note</h2>
			<form onSubmit={addNote}>
				<input
					type="text"
					value={newNote}
					onChange={handleChange}
					placeholder='Write note here'
				/>
				<button type="submit">save</button>
			</form>
		</div>
	)
}

export default NoteForm