import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from './NoteForm'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
	const createNote = jest.fn()
	const user = userEvent.setup()

	render(<NoteForm createNote={createNote}/>)

	const input = screen.getByPlaceholderText('Write note here')
	const sendButton = screen.getByText('save')

	await user.type(input, 'testing a form input')
	await user.click(sendButton)

	expect(createNote.mock.calls).toHaveLength(1)
	expect(createNote.mock.calls[0][0].content).toBe('testing a form input')
})