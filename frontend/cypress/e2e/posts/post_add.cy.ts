describe("User Add", () => {
  beforeEach(() => {
    cy.loginByClient();
    cy.wait(500);
  });

  it("Form Validation", () => {
    cy.visit("http://localhost:3000/posts/create");

    cy.get("[type=submit]").click();

    cy.contains("Title is required");
    cy.contains("Content is required");
  });
});

export {};
