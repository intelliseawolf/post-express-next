describe("Auth", () => {
  describe("Register", () => {
    it("Form Validation", () => {
      cy.visit("http://localhost:3000/register");

      cy.get("[type=submit]").click();

      cy.contains("Email is required");
      cy.contains("First name is required");
      cy.contains("Last name is required");
      cy.contains("Password is required");
    });

    it("email validation", () => {
      cy.visit("http://localhost:3000/register");

      cy.get("input[id=email]").type("email").should("have.value", "email");
      cy.get("[type=submit]").click();

      cy.contains("Email must be a valid email");
    });

    it("password length validation", () => {
      cy.visit("http://localhost:3000/register");

      cy.get("input[id=password]").type("123").should("have.value", "123");
      cy.get("[type=submit]").click();

      cy.contains("Password must be at least 6 characters");
    });

    it("confirm password validation", () => {
      cy.visit("http://localhost:3000/register");

      cy.get("input[id=password]")
        .type("123123")
        .should("have.value", "123123");
      cy.get("input[id=confirmPassword]")
        .type("1234")
        .should("have.value", "1234");
      cy.get("[type=submit]").click();

      cy.contains("Passwords must match");
    });

    it("validation for already using of email", () => {
      cy.intercept("POST", "/api/register").as("register");
      cy.visit("http://localhost:3000/register");

      cy.get("input[id=firstname]").type("Joe").should("have.value", "Joe");
      cy.get("input[id=lastname]").type("Smith").should("have.value", "Smith");
      cy.get("input[id=email]")
        .type("joe@gmail.com")
        .should("have.value", "joe@gmail.com");
      cy.get("input[id=password]")
        .type("123123")
        .should("have.value", "123123");
      cy.get("input[id=confirmPassword]")
        .type("123123")
        .should("have.value", "123123");
      cy.get("[type=submit]").click();

      cy.wait("@register").its("response.statusCode").should("eq", 422);
    });
  });

  describe("Login", () => {
    it("Form Validation", () => {
      cy.visit("http://localhost:3000/login");

      cy.get("[type=submit]").click();

      cy.contains("Email is required");
      cy.contains("Password is required");
    });

    it("email validation", () => {
      cy.visit("http://localhost:3000/login");

      cy.get("input[id=email]").type("email").should("have.value", "email");
      cy.get("[type=submit]").click();

      cy.contains("Email must be a valid email");
    });

    it("password length validation", () => {
      cy.visit("http://localhost:3000/login");

      cy.get("input[id=password]").type("123").should("have.value", "123");
      cy.get("[type=submit]").click();

      cy.contains("Password must be at least 6 characters");
    });

    it("should enter a homepage", () => {
      cy.visit("http://localhost:3000/login");

      cy.get("input[id=email]")
        .type("admin@gmail.com")
        .should("have.value", "admin@gmail.com");
      cy.get("input[id=password]")
        .type("123123")
        .should("have.value", "123123");
      cy.get("[type=submit]").click();

      cy.contains("Welcome to the Post App");
    });
  });

  describe("Authorization", () => {
    it("do not enter a homepage without credential", () => {
      cy.visit("http://localhost:3000");

      cy.url().should("eq", "http://localhost:3000/login");
    });

    it("do not enter auth pages like login page after doing login", () => {
      cy.loginByClient();
      cy.wait(1000);
      cy.visit("http://localhost:3000/login");

      cy.url().should("eq", "http://localhost:3000/");
    });
  });

  describe("Authentication", () => {
    beforeEach(() => {
      cy.loginByClient();
    });

    it("Only admin have permission to manage users", () => {
      cy.contains("User").should("not.exist");

      cy.visit("http://localhost:3000/users");
      cy.url().should("eq", "http://localhost:3000/");
    });
  });
});

export {};
