describe('Signup', () => {
    it('Should signup', () => {
      cy.visit('http://localhost:3000/')
      cy.get('a[href="/signup"]').click()

      const carroça = (Date.now() / 1000)

      cy.log(`Creating test user: ${carroça}`)

      cy.get('input[id="name"]').type(`${carroça}`)
      cy.get('input[id="email"]').type(`teste_${carroça}@teste.com`)
      cy.get('input[id="password"]').type(`${carroça}`)
      cy.get('input[id="confirmPassword"]').type(`${carroça}`)
      cy.get('button[type="submit"]').click()
      cy.url().should('not.include', '/signup')
    })
  })
  