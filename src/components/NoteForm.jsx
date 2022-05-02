import { useState } from "react"

const NoteForm = ({createNote}) => {
	const [newNote, setNewNote] = useState('a new note')

	const handleChange = evt =>{
		setNewNote(evt.target.value)
	}

	const addNote = evt => {
		evt.preventDefault()
		createNote({
			content: newNote,
			important: Math.random() > 0.5
		})
		setNewNote('')
	}

	return (
		<div>
			<h2>Create a new note</h2>
			<form onSubmit={addNote}>
				<input type="text" value={newNote} onChange={handleChange} />
				<button type="submit">save</button>
			</form>
		</div>
	)
}

export default NoteForm