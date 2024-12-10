import { test, expect } from "@playwright/test";

test.describe("API Keys Management", () => {
    const OPENAI_KEY = "sk-proj-Q0uT4Rq8AkfawBan49HLT7BibkFJNhIZ9zeC44nCZzwk1UZF";
    const TAVILY_KEY = "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";

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto("http://localhost:5173/");
    });

    test("should successfully insert new API keys", async ({ page }) => {
        // Insert API keys
        await page.getByPlaceholder("sk-").click();
        await page.getByPlaceholder("sk-").fill(OPENAI_KEY);
        await page.getByPlaceholder("tvly-").click();
        await page.getByPlaceholder("tvly-").fill(TAVILY_KEY);
        await page.getByRole("button", { name: "Continue" }).click();

        // Verify successful insertion
        await expect(
            page.getByRole("button", { name: "Manage API Keys" })
        ).toBeVisible();
    });

    test("should successfully update existing API keys", async ({ page }) => {
        // First insert API keys
        await page.getByPlaceholder("sk-").fill(OPENAI_KEY);
        await page.getByPlaceholder("tvly-").fill(TAVILY_KEY);
        await page.getByRole("button", { name: "Continue" }).click();

        // Update API keys
        await page.getByRole("button", { name: "Manage API Keys" }).click();
        await page
            .locator("div")
            .filter({ hasText: /^OpenAI API Key$/ })
            .getByRole("button")
            .click();
        await page.getByPlaceholder("sk-").click();
        await page
            .locator("div")
            .filter({ hasText: /^Tavily API Key$/ })
            .getByRole("button")
            .click();
        await page.getByPlaceholder("tvly-").click();
        await page.getByRole("button", { name: "Update Keys" }).click();

        // Verify successful update
        await expect(
            page.getByRole("button", { name: "Manage API Keys" })
        ).toBeVisible();
    });

    test("should successfully delete API keys", async ({ page }) => {
        // First insert API keys
        await page.getByPlaceholder("sk-").fill(OPENAI_KEY);
        await page.getByPlaceholder("tvly-").fill(TAVILY_KEY);
        await page.getByRole("button", { name: "Continue" }).click();

        // Delete API keys
        await page.getByRole("button", { name: "Manage API Keys" }).click();
        await page.getByRole("button", { name: "Delete Keys" }).click();
        await page.getByRole("button", { name: "Yes, Delete" }).click();

        // Verify successful deletion
        await expect(
            page.getByText("Enter Your API KeysYour keys")
        ).toBeVisible();
    });
});
