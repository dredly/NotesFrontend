import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
	const [notes, setNotes] = useState([])
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState(null)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	const noteFormRef = useRef()

	const hook = () => {
		noteService
			.getAll()
			.then(initialNotes => {
				setNotes(initialNotes)
			})
	}

	useEffect(hook, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			noteService.setToken(user.token)
		}
	}, [])

	const addNote = noteObj => {
		noteFormRef.current.toggleVisibility()
		noteService
			.create(noteObj)
			.then(returnedNote => {
				setNotes(notes.concat(returnedNote))
			})
	}


	const notesToShow = showAll
		? notes
		: notes.filter(note => note.important)

	const toggleImportanceOf = id => {
		const note = notes.find(n => n.id === id)
		const changedNote = { ...note, important: !note.important }

		noteService
			.update(id, changedNote)
			.then(returnedNote => {
				setNotes(notes.map(note => note.id !== id ? note : returnedNote))
			})
			.catch(() => {
				setErrorMessage(`The note '${note.content}' was already deleted from the server`)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setNotes(notes.filter(n => n.id !== id))
			})
	}

	const handleLogin = async evt => {
		evt.preventDefault()
		try {
			const user = await loginService.login({
				username, password
			})
			window.localStorage.setItem(
				'loggedNoteappUser', JSON.stringify(user)
			)
			noteService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	const loginForm = () => {
		return (
			<Togglable buttonLabel='login'>
				<LoginForm
					username={username}
					password={password}
					handleUsernameChange={({ target }) => setUsername(target.value)}
					handlePasswordChange={({ target }) => setPassword(target.value)}
					handleSubmit={handleLogin}
				/>
			</Togglable>
		)
	}

	const noteForm = () => (
		<Togglable buttonLabel='new note' ref={noteFormRef}>
			<NoteForm createNote={addNote}/>
		</Togglable>
	)

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			{user === null && loginForm()}
			{user !== null &&
        <div><p>{user.name} logged in</p>{noteForm()}
        </div>
			}
			<div>
				<button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
				</button>
			</div>
			<ul>
				{notesToShow.map(note =>
					<Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
				)}
			</ul>

			<Footer />
		</div>
	)
}

export default App
