describe('Login', () => {
    it('Should login', () => {
      cy.visit('https://groovetree.vercel.app/')
      cy.get('a[href="/login"]').click()

      cy.get('input[id="email"]').type('teste@teste.com')
      cy.get('input[name="password"]').type('1q2w3E*')
      cy.get('button[type="submit"]').click()
      // TODO
    })
  })
  