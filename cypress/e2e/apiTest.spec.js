import { faker } from "@faker-js/faker";

describe("API Testing with Cypress", () => {
  beforeEach("login to app", () => {
    cy.loginToApplication();
  }),
    afterEach("logout from app", () => {
      cy.logoutFromApplication();
    }),
    it("New Article Creation", () => {
      // We use cy.intercept() to intercept the POST request to the /api/articles endpoint.
      cy.intercept("POST", "**/api/articles").as("postArticle");
      const fakeTitle = faker.lorem.words(3);
      const fakeSummary = faker.lorem.words(5);
      const fakeArticle = faker.lorem.words(10);
      cy.get(".nav-link").contains("New Article").click();
      cy.get('[placeholder="Article Title"]').type(fakeTitle);
      cy.get('[placeholder="What\'s this article about?"]').type(fakeSummary);
      cy.get('[placeholder="Write your article (in markdown)"]').type(
        fakeArticle
      );
      cy.get("button").contains("Publish Article").click();

      // We could alternatively use cy.wait('@postArticle').its('response.body')
      // for a more cypress-like way of handling the response, but using then()
      // allows us to log the response to the console.
      cy.wait("@postArticle").then((interception) => {
        console.log("API Response:", interception.response.body);
        expect(interception.response.statusCode).to.be.oneOf([200, 201]);
        expect(interception.response.body.article.title).to.eq(fakeTitle);
        expect(interception.response.body.article.body).to.eq(fakeArticle);
        expect(interception.response.body.article.description).to.eq(
          fakeSummary
        );
      });
      cy.wait(1000);
      cy.get("h1").should("contain", fakeTitle);
      cy.get("p").should("contain", fakeArticle);
      cy.get(".nav-link").contains("Home").click();
      cy.get(".article-preview").first().should("contain", fakeSummary).click();
      cy.get(".article-actions").contains("Delete Article").click();
      cy.get(".article-preview").first().should("not.contain", fakeSummary);
    });
  it("Intercepting and Mocking API Calls", () => {
    cy.intercept("GET", "**/api/tags", {
      fixture: "tags.json",
      statusCode: 200,
    }).as("getTags");

    cy.visit("https://conduit.bondaracademy.com"); // Force a fresh page load
    cy.wait("@getTags");

    cy.get(".tag-list")
      .should("contain", "cypress")
      .and("contain", "testing")
      .and("contain", "automation");
  });
  it("Intercepting and Mocking API Calls 2", () => {
    // Intercept feed request
    cy.intercept("GET", "**/api/articles/feed*", {
      fixture: "articles.json",
    }).as("articleFeed");

    // Intercept global articles request
    cy.intercept("GET", "**/api/articles*", {
      fixture: "articles.json",
    }).as("getArticles");

    // Visit page and wait for initial load
    cy.reload();
    cy.wait("@getArticles");

    // Check the that the favorited article has the correct count on the webpage
    // The API response is mocked to have 10 favorites when it actually has 0
    cy.get("app-favorite-button").eq(0).click().should("contain", "11");

    cy.intercept("DELETE", "**/api/articles/*/favorite").as("deleteFavorite");
    cy.get(".article-preview").first().find("app-favorite-button").click();

    // Single wait with chained assertions
    cy.wait("@deleteFavorite").its("response.statusCode").should("eq", 200);
    cy.get("@deleteFavorite")
      .its("response.body.article.favorited")
      .should("be.false");
    cy.get("@deleteFavorite")
      .its("response.body.article.favoritesCount")
      .should("eq", 0);

    cy.get("app-favorite-button").eq(0).click().should("contain", "10");
  });

  it("Making API calls with cy.request", () => {
    const fakeTitle = faker.lorem.words(3);
    // Define credentials
    const credentials = {
      user: {
        email: "topitestaaja@mail.com",
        password: "topitestaa",
      },
    };
    cy.request(
      "POST",
      "https://conduit-api.bondaracademy.com/api/users/login",
      credentials
    )
      .its("body")
      .then((response) => {
        const token = response.user.token;

        cy.request({
          method: "POST",
          url: "https://conduit-api.bondaracademy.com/api/articles/",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: {
            article: {
              title: fakeTitle,
              description: "Cypress API testing description",
              body: "Cypress API testing body",
            },
          },
        });
        cy.reload();

        cy.get(".article-preview").first().should("contain", fakeTitle).click();
        cy.get("h1").should("contain", fakeTitle);
        cy.get("p").should("contain", "Cypress API testing body");
        cy.get(".article-actions").contains("Delete Article").click();
        cy.get(".article-preview").should("not.contain", fakeTitle);
      });
  });
});
