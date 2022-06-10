declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    loginByAdmin(): Chainable<Element>;
    loginByClient(): Chainable<Element>;
  }
}
