Cypress.on('uncaught:exception', () => {
	return false
})

describe('Note App', function() {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3000/api/testing/reset')
		const user = {
			name: 'Root User',
			username: 'root',
			password: 'miguel'
		}
		cy.request('POST', 'http://localhost:3000/api/users', user)
		cy.visit('http://localhost:3000')
	})

	it('front page can be opened', function () {
		cy.contains('Notes')
		cy.contains('Note app, department of Computer Science 2022 Helsinki')
	})

	it('login fails with wrong password', function () {
		cy.contains('login').click()
		cy.get('#username').type('root')
		cy.get('#password').type('wrong')
		cy.get('#loginButton').click()

		cy.get('.error')
			.should('contain', 'Wrong credentials')
			.and('have.css', 'color', 'rgb(255, 0, 0)')
			.and('have.css', 'border-style', 'solid')

		cy.get('html').should('not.contain', 'Root User logged in')
	})

	it('user can log in', function() {
		cy.contains('login').click()
		cy.get('#username').type('root')
		cy.get('#password').type('miguel')
		cy.get('#loginButton').click()

		cy.contains('Root User logged in')
	})

	describe('when logged in', function() {
		beforeEach(function() {
			cy.login({ username: 'root', password: 'miguel' })
		})

		it('a new note can be created', function() {
			cy.contains('new note').click()
			cy.get('input').type('a note created by cypress')
			cy.contains('save').click()
			cy.contains('a note created by cypress')
		})

		describe('and several notes exist', function() {
			beforeEach(function () {
				cy.createNote({ content: 'First Note', important: false })
				cy.createNote({ content: 'Second Note', important: false })
				cy.createNote({ content: 'Third Note', important: false })
			})

			it('one of them can be made important', function () {
				cy.contains('Second Note').parent().find('button').as('theButton')
				cy.get('@theButton').click()
				cy.get('@theButton').should('contain', 'make not important')
			})
		})
	})
})
