/// <reference types="cypress" />
// ***********************************************
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

export {}; // Don't remove this :)

declare global {
  namespace Cypress {
    interface Chainable {
      Login(email?: string, password?: string): Chainable<void>
      Logout(): Chainable<void>
    }
  }
}


Cypress.Commands.add('Login', (
    email = 'admin@gmail.com', 
    password = 'admin'
  ) => {
    cy.visit('/')
  
    cy.get('a[href="/login"]').click()
  
    cy.get('input[id="email"]').type(email)
    cy.get('input[id="password"]').type(password)
    cy.get('button[type="submit"]').click()
})


Cypress.Commands.add('Logout', () => {
    //cy.get('[data-cy="user-menu"]').click();

    cy.get('[data-cy="logout-button"]').click();

    //cy.get('[data-cy="user-menu"]').should('not.exist');
})