export class FormLayoutPage {
  submitInlineFormWithNameAndEmail(Name, Email) {
    cy.contains("nb-card", "Inline form")
      .find("form")
      .then((form) => {
        cy.wrap(form).find('[placeholder="Jane Doe"]').type(Name);
        cy.wrap(form).find('[placeholder="Email"]').type(Email);
        cy.wrap(form).find('[type="checkbox"]').check({ force: true });
        cy.wrap(form).submit();
      });
  }
}

export const onFormLayoutPage = new FormLayoutPage();
