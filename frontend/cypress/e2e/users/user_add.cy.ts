describe("User Add", () => {
  beforeEach(() => {
    cy.loginByAdmin();
    cy.wait(500);
  });

  it("Form Validation", () => {
    cy.visit("http://localhost:3000/users/create");

    cy.get("[type=submit]").click();

    cy.contains("Email is required");
    cy.contains("First name is required");
    cy.contains("Last name is required");
    cy.contains("Password is required");
  });

  it("email validation", () => {
    cy.visit("http://localhost:3000/users/create");

    cy.get("input[id=email]").type("email").should("have.value", "email");
    cy.get("[type=submit]").click();

    cy.contains("Email must be a valid email");
  });

  it("password length validation", () => {
    cy.visit("http://localhost:3000/users/create");

    cy.get("input[id=password]").type("123").should("have.value", "123");
    cy.get("[type=submit]").click();

    cy.contains("Password must be at least 6 characters");
  });

  it("confirm password validation", () => {
    cy.visit("http://localhost:3000/users/create");

    cy.get("input[id=password]").type("123123").should("have.value", "123123");
    cy.get("input[id=confirmPassword]")
      .type("1234")
      .should("have.value", "1234");
    cy.get("[type=submit]").click();

    cy.contains("Passwords must match");
  });

  it("validation for already using of email", () => {
    cy.intercept("POST", "/api/users").as("createUser");
    cy.visit("http://localhost:3000/users/create");

    cy.get("input[id=firstname]").type("Joe").should("have.value", "Joe");
    cy.get("input[id=lastname]").type("Smith").should("have.value", "Smith");
    cy.get("input[id=email]")
      .type("joe@gmail.com")
      .should("have.value", "joe@gmail.com");
    cy.get("input[id=password]").type("123123").should("have.value", "123123");
    cy.get("input[id=confirmPassword]")
      .type("123123")
      .should("have.value", "123123");
    cy.get("[type=submit]").click();

    cy.wait("@createUser").its("response.statusCode").should("eq", 422);
  });

  // it("should create a user", () => {
  //   cy.intercept("POST", "/api/users").as("createUser");
  //   cy.visit("http://localhost:3000/users/create");

  //   cy.get("input[id=firstname]").type("John").should("have.value", "John");
  //   cy.get("input[id=lastname]").type("Smith").should("have.value", "Smith");
  //   cy.get("input[id=email]")
  //     .type("john@gmail.com")
  //     .should("have.value", "john@gmail.com");
  //   cy.get("input[id=password]").type("123123").should("have.value", "123123");
  //   cy.get("input[id=confirmPassword]")
  //     .type("123123")
  //     .should("have.value", "123123");
  //   cy.get("[type=submit]").click();

  //   cy.contains("john@gmail.com");
  // });
});

export {};
