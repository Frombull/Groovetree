describe('Home page', () => {
  it('should load the home page', () => {
    cy.visit('https://groovetree.vercel.app/')
    cy.contains('Groovetree').should('be.visible')
  })
})