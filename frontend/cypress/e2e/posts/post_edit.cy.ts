describe("User Add", () => {
  beforeEach(() => {
    cy.loginByClient();
    cy.wait(500);
  });

  it("Form Validation", () => {
    cy.visit("http://localhost:3000/posts");
    cy.contains("Wow")
      .parent()
      .find("[data-testid=EditIcon]")
      .click({ force: true });
    cy.get("input[id=title]").clear();
    cy.get("textarea[id=content]").clear();
    cy.get("[type=submit]").click();

    cy.contains("Title is required");
    cy.contains("Content is required");
  });
});

export {};
