import { test } from "../core";
import { expect } from "@playwright/test";
import {
  createForm,
  createValueReference,
  addFormResources,
  deleteForm,
} from "../commands/formOperations";
import { FormBuilderPage } from "../pages";
import { Form } from "../../src/types";

let form: Form = null;
test.beforeEach(async ({ api }) => {
  form = await createForm(api, false);
  const valueReference = await createValueReference(api);
  await addFormResources(api, valueReference, form.uuid);
});

test("Publish a form", async ({ page }) => {
  const formBuilderPage = new FormBuilderPage(page);

  await test.step("When I visit the form builder page", async () => {
    await formBuilderPage.gotoFormBuilder();
  });

  await test.step("And I click on a form I need to publish", async () => {
    await page.getByTestId(`editSchema${form.uuid}`).click();
  });

  await test.step("Then I click on the publish form button", async () => {
    await formBuilderPage.publishFormButton().click();
  });

  await test.step("The I should see the form published notification and the unpublish form button", async () => {
    await expect(page.getByText("Form published")).toBeVisible();
    await expect(formBuilderPage.unpublishFormButton()).toBeVisible();
  });
});

test.afterEach(async ({ api }) => {
  if (form) {
    await deleteForm(api, form.uuid);
  }
});