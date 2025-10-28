describe('Create Artist Page', () => {
  it('should create the artist page', () => {
    cy.Login();

    cy.get('[data-cy="page-artist-name"]', { timeout: 10000 }) // a
      .should('be.visible')
      .wait(2000)
      .type("{selectall}Artista Feliz");

    cy.get('[data-cy="page-bio-description"]')
      .should('be.visible')
      .type("{selectall}Descrição Feliz :3 :) >.< >//< x3 ¬¬ ^-^");

    cy.get('[data-cy="page-background-color"]')
      .should('be.visible')
      .type('{selectall}#aa9d9d');

    cy.get('[data-cy="page-text-color"]')
      .should('be.visible')
      .type('{selectall}#e8e8e8');

    cy.get('[data-cy="page-background-image-url"]')
      .should('be.visible')
      .type('{selectall}https://wallpapercave.com/wp/wp9414303.jpg');

    cy.get('[data-cy="page-save-customization-button"]')
    .wait(2000)
    .click();

    cy.get('[data-cy="page-preview-button"]')
      .should('be.visible')
      .click()
      .wait(10000);
  });
});
