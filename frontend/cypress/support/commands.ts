/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
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

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

Cypress.Commands.add("loginByAdmin", () => {
  cy.visit("http://localhost:3000/login");

  cy.get("input[id=email]")
    .type("admin@gmail.com")
    .should("have.value", "admin@gmail.com");
  cy.get("input[id=password]").type("123123").should("have.value", "123123");
  cy.get("[type=submit]").click();
});

Cypress.Commands.add("loginByClient", () => {
  cy.visit("http://localhost:3000/login");

  cy.get("input[id=email]")
    .type("joe@gmail.com")
    .should("have.value", "joe@gmail.com");
  cy.get("input[id=password]").type("123123").should("have.value", "123123");
  cy.get("[type=submit]").click();
});

export {};
