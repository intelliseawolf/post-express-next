describe("User Add", () => {
  beforeEach(() => {
    cy.loginByAdmin();
    cy.wait(500);
  });

  it("Form Validation", () => {
    cy.visit("http://localhost:3000/users");
    cy.contains("joe@gmail.com")
      .parent()
      .find("[data-testid=EditIcon]")
      .click({ force: true });
    cy.get("input[id=firstname]").clear();
    cy.get("input[id=lastname]").clear();
    cy.get("[type=submit]").click();

    cy.contains("First name is required");
    cy.contains("Last name is required");
  });
});

export {};
