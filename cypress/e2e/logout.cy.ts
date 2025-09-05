describe('Logout', () => {
    it('Should login then logout', () => {
      cy.Login();
      cy.Logout();
    })
  })
  