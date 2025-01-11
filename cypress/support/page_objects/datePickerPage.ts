export class DatePickerPage {
  private readonly CALENDAR_TIMEOUT = 10000;

  private selectFutureDate(daysFromToday: number): Cypress.Chainable<string> {
    if (daysFromToday < 0) {
      throw new Error("Days from today must be a positive number");
    }

    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);

    const futureDay = date.getDate();
    const futureMonth = date.toLocaleString("en-US", { month: "short" });
    const futureYear = date.getFullYear();
    const futureAssertDate = `${futureMonth} ${futureDay}, ${futureYear}`;

    return cy
      .get("nb-calendar-navigation", { timeout: this.CALENDAR_TIMEOUT })
      .invoke("attr", "ng-reflect-date")
      .then((dateAttribute) => {
        if (!dateAttribute) {
          throw new Error("Date attribute not found in calendar navigation");
        }

        if (
          !dateAttribute.includes(futureMonth) ||
          !dateAttribute.includes(futureYear.toString())
        ) {
          cy.get('[data-name="chevron-right"]').click();
          return this.selectFutureDate(daysFromToday);
        }

        cy.get(".day-cell")
          .not(".bounding-month")
          .contains(futureDay)
          .should("be.visible")
          .click();

        return cy.wrap(futureAssertDate);
      });
  }

  selectCommonDatePickerFromToday(daysFromToday: number): void {
    cy.contains("nb-card", "Datepicker")
      .should("be.visible")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        this.selectFutureDate(daysFromToday).then((dateAssert) => {
          cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
          cy.wrap(input).should("have.value", dateAssert);
        });
      });
  }

  selectDatePickerWithRangeFromToday(
    firstDay: number,
    secondDay: number
  ): void {
    if (secondDay <= firstDay) {
      throw new Error("Second day must be greater than first day");
    }

    cy.contains("nb-card", "Datepicker With Range")
      .should("be.visible")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        this.selectFutureDate(firstDay).then((dateAssertFirst) => {
          this.selectFutureDate(secondDay).then((dateAssertSecond) => {
            const finalDate = `${dateAssertFirst} - ${dateAssertSecond}`;
            cy.wrap(input).invoke("prop", "value").should("contain", finalDate);
            cy.wrap(input).should("have.value", finalDate);
          });
        });
      });
  }
}

export const onDatePickerPage = new DatePickerPage();
