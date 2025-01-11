/// <reference types="cypress" />

// Simply put: You create suites under the 'describe' function.
// You then create test cases under the 'describe' function using the 'it' function.
// Using the anonymous arrow function

describe("First test suite", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/");
    cy.get("ngx-footer").should("have.text", "Created with ♥ by Akveo 2019");
  });

  it("Lesson 1: First test case", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // Locating elements

    // By Tag
    cy.get("input");

    // By ID
    cy.get("#inputEmail1");

    // By Class
    cy.get(".input-full-width");

    // By Attribute
    cy.get("[fullwidth]");

    // By Placeholder
    cy.get("[placeholder=Email]");

    // Full class selector
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    // Multiple attributes
    cy.get('[placeholder="Email"][fullwidth]');

    // By Tag, Attribute ID and Class
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');
  });

  it("Lesson 2: Finding Elements", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // Theory
    // get() - get all elements that match the selector
    // find() - get all elements that match the selector inside the parent element
    // contains() - get all elements that contain something specific

    cy.contains("Sign in");
    cy.contains('[status="warning"]', "Sign in");

    cy.contains("nb-card", "Horizontal form").find("button");
    cy.contains("nb-card", "Horizontal form").contains("Sign in");

    // Cypress chaining
    // Remember any actions (type, click, etc.) should be done last as it can change the element in the DOM
    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("have.text", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();
  });

  it("Lesson 3: Saving Locators", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // THIS IS WRONG EVEN THOUGH YOU'D
    // DO IT LIKE THIS ON OTHER FRAMEWORKS
    // const usingTheGrid = cy.contains("nb-card", "Using the grid");
    // usingTheGrid.find('[for="inputEmail1"]').should("contain", "Email");
    // usingTheGrid.find('[for="inputPassword2"]').should("contain", "Password");

    // 1. Cypress Alias
    // Can be called anywhere in the test since it's a global variable
    cy.contains("nb-card", "Using the Grid").as("usingTheGrid");
    cy.get("@usingTheGrid")
      .find('[for="inputEmail1"]')
      .should("contain", "Email");
    cy.get("@usingTheGrid")
      .find('[for="inputPassword2"]')
      .should("contain", "Password");

    // 2. Cypress then()
    // You need to wrap the element in a cy.wrap() to chain cypress methods
    // Calling the the element outside of the then() block will not work
    // because it is only visible inside the then() block
    cy.contains("nb-card", "Using the Grid").then((usingTheGrid) => {
      cy.wrap(usingTheGrid)
        .find('[for="inputEmail1"]')
        .should("contain", "Email");
      cy.wrap(usingTheGrid)
        .find('[for="inputPassword2"]')
        .should("contain", "Password");
    });
    // This will fail
    // cy.wrap(usingTheGrid).find('[for="inputPassword2"]').should("contain", "Password");
  });

  it("Lesson 4: Extractring Data", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // 1 Using cypress methods
    cy.get('[for="exampleInputEmail1"]').should("contain", "Email address");

    // 2 Using cypress then()
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      const labelText = label.text();
      expect(labelText).equal("Email address"); // Jquery
      cy.wrap(label).should("contain", "Email address"); // Cypress
    });

    // 3 Cypress Invoke
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((text) => {
        expect(text).equal("Email address");
      });

    // Or the easier way
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .should("equal", "Email address");

    // You can also save the text after invoking it
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .as("emailText")
      .should("equal", "Email address");

    // 4 Invoking attributes
    cy.get('[for="exampleInputEmail1"]')
      .invoke("attr", "class")
      .should("equal", "label");

    // 5 Invoking properties
    cy.get("#exampleInputEmail1").type("test@test.com");
    cy.get("#exampleInputEmail1")
      .invoke("prop", "value")
      .should("contain", "test@test.com");
  });

  it("Lesson 5: Interacting with Checkboxes and Radio Buttons", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid").as("usingTheGrid");
    cy.get("@usingTheGrid")
      .find('[type="radio"]')
      .then((radioButtons) => {
        // Use check() to work with radio buttons and checkboxes
        cy.wrap(radioButtons).eq(0).check({ force: true }).should("be.checked"); // Use force to bypass attributes to block interaction
        cy.wrap(radioButtons).eq(1).check({ force: true });
        cy.wrap(radioButtons).eq(0).should("not.be.checked");
        cy.wrap(radioButtons).eq(2).should("be.disabled");
      });

    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    // Use force: true to bypass elements with problematic interactivity
    cy.get('[type="checkbox"]').check({ force: true });
  });

  it("Lesson 6: Interacting with Datepickers", () => {
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const dayValue = currentDate.getDate();

    cy.get('[placeholder="Form Picker"]').click();
    cy.get(".day-cell").contains(dayValue).click();
    cy.get('[placeholder="Form Picker"]')
      .invoke("prop", "value")
      .should("contain", formattedDate);
  });

  it("Lesson 6.5: Datepicker with future date", () => {
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    let date = new Date();
    date.setDate(date.getDate() + 40);
    let futureDay = date.getDate();
    let futureMonth = date.toLocaleString("en-US", { month: "short" });
    let futureYear = date.getFullYear();
    let futureDate = `${futureMonth} ${futureDay}, ${futureYear}`;

    cy.contains("nb-card", "Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        function selectDayFromCurent() {
          cy.get("nb-calendar-navigation")
            .invoke("attr", "ng-reflect-date")
            .then((dateAttribute) => {
              if (
                !dateAttribute.includes(futureMonth) ||
                !dateAttribute.includes(futureYear.toString())
              ) {
                cy.get('[data-name="chevron-right"]').click();
                selectDayFromCurent();
              } else {
                cy.get(".day-cell")
                  .not(".bounding-month")
                  .contains(futureDay)
                  .click();
              }
            });
        }
        selectDayFromCurent();
        cy.wrap(input).invoke("prop", "value").should("contain", futureDate);
        cy.wrap(input).should("have.value", futureDate);
      });
  });
  it("Lesson 7: Interacting with Dropdowns", () => {
    const dropdownOptions = ["Light", "Dark", "Cosmic", "Corporate"];
    cy.get(".select-button").click();
    for (let i = 0; i < dropdownOptions.length; i++) {
      cy.get(".options-list").contains(dropdownOptions[i]).click();
      cy.get(".select-button").click();
    }
  });
  it("Lesson 8: Interacting with Web Tables", () => {
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();
    // Get row by text
    cy.get("tbody")
      .contains("tr", "Larry")
      .then((row) => {
        cy.wrap(row).find(".nb-edit").click();
        cy.wrap(row).find("[placeholder='Age']").clear().type("55");
        cy.wrap(row).find(".nb-checkmark").click();
        cy.wrap(row).find("td").last().should("contain", "55");
      });
    // Get row by index
    const randomId = Math.floor(Math.random() * 1000).toString();
    cy.get(".nb-plus").click();
    cy.get("tr")
      .eq(2)
      .then((newRow) => {
        cy.wrap(newRow).find("[placeholder='ID']").type(randomId);
        cy.wrap(newRow).find("[placeholder='First Name']").type("Jimmy");
        cy.wrap(newRow).find("[placeholder='Last Name']").type("Johnson");
        cy.wrap(newRow).find("[placeholder='Username']").type("jjohnson");
        cy.wrap(newRow)
          .find("[placeholder='E-mail']")
          .type("jjohnson@mail.com");
        cy.wrap(newRow).find("[placeholder='Age']").type("25");
        cy.wrap(newRow).find(".nb-checkmark").click();
      });
    cy.get("tr")
      .eq(2)
      .invoke("text")
      .should("contain", `${randomId}JimmyJohnsonjjohnsonjjohnson@mail.com25`);

    const age = [20, 30, 40, 300];
    // Validate each row
    cy.wrap(age).each((age) => {
      cy.get('thead [placeholder="Age"]').clear().type(age.toString());
      cy.wait(750);
      cy.get("tbody tr").each((tableRow) => {
        if (parseInt(age.toString()) === 300) {
          cy.wrap(tableRow).find("td").should("contain", "No data found");
        } else {
          cy.wrap(tableRow).find("td").eq(6).should("contain", age.toString());
        }
      });
    });
  });
  it.only("Lesson 9: Tooltips and Overlays", () => {
    cy.contains("Modal & Overlay").click();
    cy.contains("Tooltip").click();

    cy.contains("nb-card", "Colored Tooltips").contains("Default").click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");

    // Alert overlay
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();
    cy.get(".nb-trash").click();
    cy.on("window:confirm", () => false);
  });
});
