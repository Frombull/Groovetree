describe('Create Artist Page', () => {
  it('should create the artist page', () => {
    cy.Login();

    cy.wait(4000);
    cy.get('[data-cy="page-artist-name"]').type("{selectall}Artista Feliz");
    cy.wait(1000);
    cy.get('[data-cy="page-bio-description"]').type("{selectall}Descrição Feliz :3 :) >.< >//< x3 ¬¬ ^-^"); 
    cy.wait(1000);
    cy.get('[data-cy="page-background-color"]').type('{selectall}#aa9d9d');
    cy.wait(1000);
    cy.get('[data-cy="page-text-color"]').type('{selectall}#e8e8e8');
    cy.wait(1000);
    cy.get('[data-cy="page-background-image-url"]').type('{selectall}https://wallpapercave.com/wp/wp9414303.jpg');
    
    cy.wait(1000);
    cy.get('[data-cy="page-save-customization-button"]').click()
    
    cy.wait(2000);
    cy.get('[data-cy="page-preview-button"]').click()
    cy.wait(8000);


  })
})

