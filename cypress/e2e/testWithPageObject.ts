import { onDatePickerPage } from "../support/page_objects/datePickerPage";
import { onFormLayoutPage } from "../support/page_objects/formLayoutPage";
import { navigateTo } from "../support/page_objects/navigation";

describe("Test with Page Object", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("ngx-footer").should("have.text", "Created with ♥ by Akveo 2019");
  });

  it("Verify Navigation of Pages", () => {
    navigateTo.formLayoutsPage();
    navigateTo.datePickerPage();
    navigateTo.smartTablePage();
    navigateTo.toastrPage();
    navigateTo.tooltipPage();
  });

  it.only("Submit form and select date from calendar", () => {
    navigateTo.formLayoutsPage();
    onFormLayoutPage.submitInlineFormWithNameAndEmail(
      "John Johnson",
      "john@johnson.com"
    );
    navigateTo.datePickerPage();
    onDatePickerPage.selectCommonDatePickerFromToday(3);
    onDatePickerPage.selectDatePickerWithRangeFromToday(3, 5);
  });
});
