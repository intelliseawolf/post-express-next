describe("Post CRUD", () => {
  beforeEach(() => {
    cy.loginByClient();
    cy.wait(500);
  });

  it("create a post", () => {
    cy.visit("http://localhost:3000/posts/create");

    cy.get("input[id=title]")
      .type("text for title")
      .should("have.value", "text for title");
    cy.get("textarea[id=content]")
      .type("text for content")
      .should("have.value", "text for content");
    cy.get("[type=submit]").click();

    cy.contains("text for title");
    cy.contains("text for content");
  });

  it("update a post", () => {
    cy.visit("http://localhost:3000/posts");
    cy.contains("text for title")
      .parent()
      .find("[data-testid=EditIcon]")
      .click({ force: true });
    cy.get("input[id=title]")
      .clear()
      .type("updated title")
      .should("have.value", "updated title");
    cy.get("textarea[id=content]")
      .clear()
      .type("updated content")
      .should("have.value", "updated content");
    cy.get("[type=submit]").click();

    cy.contains("updated title");
    cy.contains("updated content");
  });

  it("delete a post", () => {
    cy.visit("http://localhost:3000/posts");
    cy.contains("updated title")
      .parent()
      .find("[data-testid=DeleteIcon]")
      .click({ force: true });
    cy.contains("Agree").click();

    cy.contains("text for title").should("not.exist");
  });
});

export {};
