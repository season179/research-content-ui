import { test, expect } from "@playwright/test";

// Run tests serially to avoid IndexedDB conflicts
test.describe.configure({ mode: "serial" });

test.describe("API Keys Management", () => {
    const OPENAI_KEY =
        "sk-proj-Q0uT4Rq8AkfawBan49HLT7BibkFJNhIZ9zeC44nCZzwk1UZF";
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

        // Verify successful insertion in UI
        await expect(
            page.getByRole("button", { name: "Manage API Keys" })
        ).toBeVisible();
    });

    test("should successfully update existing API keys", async ({ page }) => {
        // First insert API keys
        await page.getByPlaceholder("sk-").fill(OPENAI_KEY);
        await page.getByPlaceholder("tvly-").fill(TAVILY_KEY);
        await page.getByRole("button", { name: "Continue" }).click();

        // Update API keys with new values
        const NEW_OPENAI_KEY = "sk-proj-NewOpenAIKey123456789abcdefghijklmnop";
        const NEW_TAVILY_KEY = "tvly-NewTavilyKey123456789";

        await page.getByRole("button", { name: "Manage API Keys" }).click();
        await page
            .locator("div")
            .filter({ hasText: /^OpenAI API Key$/ })
            .getByRole("button")
            .click();
        await page.getByPlaceholder("sk-").click();
        await page.getByPlaceholder("sk-").fill(NEW_OPENAI_KEY);
        await page
            .locator("div")
            .filter({ hasText: /^Tavily API Key$/ })
            .getByRole("button")
            .click();
        await page.getByPlaceholder("tvly-").click();
        await page.getByPlaceholder("tvly-").fill(NEW_TAVILY_KEY);
        await page.getByRole("button", { name: "Update Keys" }).click();

        // Verify successful update in UI
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

        // Verify successful deletion in UI
        await expect(
            page.getByText("Enter Your API KeysYour keys")
        ).toBeVisible();
    });

    test.describe("Input Validation", () => {
        test("should show error for empty API keys", async ({ page }) => {
            // Try to submit without entering any keys
            await page.getByRole("button", { name: "Continue" }).click();

            // Verify error messages
            await expect(
                page.getByText("OpenAI API key is required")
            ).toBeVisible();
            await expect(
                page.getByText("Tavily API key is required")
            ).toBeVisible();
        });

        test("should validate OpenAI API key format", async ({ page }) => {
            // Test invalid OpenAI key format (without sk- prefix)
            await page.getByPlaceholder("sk-").fill("invalid-key");
            await page.getByPlaceholder("tvly-").fill(TAVILY_KEY);
            await page.getByRole("button", { name: "Continue" }).click();

            // Verify error message
            await expect(
                page.getByText("Please enter a valid OpenAI API key")
            ).toBeVisible();

            // Test OpenAI key that's too short
            await page.getByPlaceholder("sk-").fill("sk-tooshort");
            await page.getByRole("button", { name: "Continue" }).click();

            // Verify error message
            await expect(
                page.getByText("Please enter a valid OpenAI API key")
            ).toBeVisible();
        });

        test("should validate Tavily API key format", async ({ page }) => {
            // Test Tavily key that's too short
            await page.getByPlaceholder("sk-").fill(OPENAI_KEY);
            await page.getByPlaceholder("tvly-").fill("short");
            await page.getByRole("button", { name: "Continue" }).click();

            // Verify error message
            await expect(
                page.getByText("Please enter a valid Tavily API key")
            ).toBeVisible();
        });

        test("should clear errors when user starts typing", async ({
            page,
        }) => {
            // Submit empty form to trigger errors
            await page.getByRole("button", { name: "Continue" }).click();

            // Verify initial error state
            await expect(
                page.getByText("OpenAI API key is required")
            ).toBeVisible();

            // Start typing in OpenAI field
            await page.getByPlaceholder("sk-").fill("sk-");

            // Verify error is cleared for OpenAI field
            await expect(
                page.getByText("OpenAI API key is required")
            ).not.toBeVisible();
        });
    });
});
