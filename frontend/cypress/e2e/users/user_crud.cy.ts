describe("User CRUD", () => {
  beforeEach(() => {
    cy.loginByAdmin();
    cy.wait(500);
  });

  it("create a user", () => {
    cy.visit("http://localhost:3000/users/create");

    cy.get("input[id=firstname]").type("John").should("have.value", "John");
    cy.get("input[id=lastname]").type("Smith").should("have.value", "Smith");
    cy.get("input[id=email]")
      .type("john@gmail.com")
      .should("have.value", "john@gmail.com");
    cy.get("input[id=password]").type("123123").should("have.value", "123123");
    cy.get("input[id=confirmPassword]")
      .type("123123")
      .should("have.value", "123123");
    cy.get("[type=submit]").click();

    cy.contains("john@gmail.com");
  });

  it("update a user", () => {
    cy.visit("http://localhost:3000/users");
    cy.contains("john@gmail.com")
      .parent()
      .find("[data-testid=EditIcon]")
      .click({ force: true });
    cy.get("input[id=firstname]")
      .clear()
      .type("Joy")
      .should("have.value", "Joy");
    cy.get("input[id=lastname]")
      .clear()
      .type("smith")
      .should("have.value", "smith");
    cy.get("#status")
      .parent()
      .click()
      .get('ul > li[data-value="true"]')
      .click();
    cy.get("[type=submit]").click();

    cy.contains("Joy");
    cy.contains("smith");
    cy.contains("john@gmail.com")
      .parent()
      .find('[type="checkbox"]')
      .should("be.checked");
  });

  it("toggle user's status", () => {
    cy.visit("http://localhost:3000/users");
    cy.contains("john@gmail.com").parent().find('[type="checkbox"]').uncheck();
    cy.contains("Agree").click();

    cy.contains("john@gmail.com")
      .parent()
      .find('[type="checkbox"]')
      .should("not.be.checked");
  });

  it("delete a user", () => {
    cy.visit("http://localhost:3000/users");
    cy.contains("john@gmail.com")
      .parent()
      .find("[data-testid=DeleteIcon]")
      .click({ force: true });
    cy.contains("Agree").click();

    cy.contains("john@gmail.com").should("not.exist");
  });
});

export {};
