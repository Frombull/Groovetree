describe('Home page', () => {
  it('should load the home page', () => {
    cy.visit('/')
    cy.contains('Groovetree').should('be.visible')
  })
})