import OpenAI from "openai";
import { apiKeyDB } from "../utils/apiKeyDB";

interface SearchResult {
    title: string;
    url: string;
    content: string;
}

interface ResearchData {
    originalQuery: string;
    refinedQuery: string;
    results: SearchResult[];
}

export async function generateTweet(
    researchData: ResearchData
): Promise<string> {
    const keys = await apiKeyDB.getApiKeys();

    if (!keys.openai) {
        throw new Error("OpenAI API key not found");
    }

    const openai = new OpenAI({
        apiKey: keys.openai,
        dangerouslyAllowBrowser: true,
    });

    const researchSummary = `
Original Query: ${researchData.originalQuery}
Refined Query: ${researchData.refinedQuery}

Key Findings:
${researchData.results
    .map((result) => `- ${result.content.slice(0, 200)}...`)
    .join("\n")}
  `.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `You are a skilled social media writer who creates engaging, informative tweets. 
          Create a tweet thread (3-5 tweets) based on the research findings.
          Each tweet should be numbered and separated by a newline.
          Include relevant emojis.
          Make it engaging and informative while maintaining accuracy.
          Each tweet must be under 280 characters.
          Don't include hashtags.`,
                },
                {
                    role: "user",
                    content: researchSummary,
                },
            ],
        });

        return (
            completion.choices[0].message.content || "Failed to generate tweet"
        );
    } catch (error) {
        console.error("Error generating tweet:", error);
        throw new Error("Failed to generate tweet");
    }
}

export async function generateBlogPost(
    researchData: ResearchData
): Promise<string> {
    const keys = await apiKeyDB.getApiKeys();

    if (!keys.openai) {
        throw new Error("OpenAI API key not found");
    }

    const openai = new OpenAI({
        apiKey: keys.openai,
        dangerouslyAllowBrowser: true,
    });

    const researchSummary = `
Original Query: ${researchData.originalQuery}
Refined Query: ${researchData.refinedQuery}

Research Findings:
${researchData.results
    .map(
        (result) => `
Source: ${result.title}
URL: ${result.url}
Content: ${result.content}
`
    )
    .join("\n---\n")}
  `.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `You are an expert blog writer who creates comprehensive, well-structured articles.
          Create a detailed blog post based on the provided research findings.
          
          IMPORTANT: Use proper markdown formatting with clear headings and spacing:
          - Use # for the main title
          - Use ## for section headings
          - Use ### for subsection headings
          - Use proper line breaks between sections
          - Use bullet points or numbered lists where appropriate
          - Use bold and italic text for emphasis
          - Include a brief summary at the start
          
          The blog post should include:
          - A compelling title
          - A brief introduction/summary
          - Well-organized sections with clear headings
          - Practical insights and takeaways
          - A strong conclusion
          
          Make it informative and engaging while maintaining accuracy.
          Aim for around 1000-1500 words.
          Include relevant examples and explanations.`,
                },
                {
                    role: "user",
                    content: researchSummary,
                },
            ],
        });

        return (
            completion.choices[0].message.content ||
            "Failed to generate blog post"
        );
    } catch (error) {
        console.error("Error generating blog post:", error);
        throw new Error("Failed to generate blog post");
    }
}

export async function generateNewsletter(
    researchData: ResearchData
): Promise<string> {
    const keys = await apiKeyDB.getApiKeys();

    if (!keys.openai) {
        throw new Error("OpenAI API key not found");
    }

    const openai = new OpenAI({
        apiKey: keys.openai,
        dangerouslyAllowBrowser: true,
    });

    const researchSummary = `
Original Query: ${researchData.originalQuery}
Refined Query: ${researchData.refinedQuery}

Research Findings:
${researchData.results
    .map(
        (result) => `
Source: ${result.title}
URL: ${result.url}
Content: ${result.content}
`
    )
    .join("\n---\n")}
  `.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `You are an expert newsletter writer who creates engaging and informative email newsletters.
          Create a newsletter based on the provided research findings.
          
          IMPORTANT: Use proper markdown formatting with clear structure:
          - Use # for the newsletter title
          - Use ## for section headings
          - Use proper line breaks between sections
          - Use bullet points for key takeaways
          - Use bold and italic text for emphasis
          
          The newsletter should include:
          - An attention-grabbing subject line (prefixed with "Subject: ")
          - A warm greeting
          - A brief introduction that hooks the reader
          - The main content broken into digestible sections
          - Key takeaways or action items
          - A call-to-action or engagement prompt
          - A professional sign-off
          
          Make it conversational yet professional.
          Keep paragraphs short and scannable.
          Include relevant examples and insights.
          Aim for around 500-800 words.`,
                },
                {
                    role: "user",
                    content: researchSummary,
                },
            ],
        });

        return (
            completion.choices[0].message.content ||
            "Failed to generate newsletter"
        );
    } catch (error) {
        console.error("Error generating newsletter:", error);
        throw new Error("Failed to generate newsletter");
    }
}

export async function generateLinkedInPost(
    researchData: ResearchData
): Promise<string> {
    const keys = await apiKeyDB.getApiKeys();

    if (!keys.openai) {
        throw new Error("OpenAI API key not found");
    }

    const openai = new OpenAI({
        apiKey: keys.openai,
        dangerouslyAllowBrowser: true,
    });

    const researchSummary = `
Original Query: ${researchData.originalQuery}
Refined Query: ${researchData.refinedQuery}

Research Findings:
${researchData.results
    .map(
        (result) => `
Source: ${result.title}
URL: ${result.url}
Content: ${result.content}
`
    )
    .join("\n---\n")}
  `.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `You are an expert LinkedIn content creator who writes engaging professional posts.
          Create a LinkedIn post based on the provided research findings.
          
          IMPORTANT: Format the post for maximum engagement:
          - Start with a strong hook (first 2-3 lines are crucial)
          - Use line breaks between paragraphs (double space)
          - Use emojis strategically at the start of key points
          - Use bullet points for key takeaways
          - Include relevant hashtags at the end (3-5 maximum)
          
          The post should include:
          - An attention-grabbing opening
          - Personal insights or professional perspective
          - Key findings or lessons learned
          - Actionable takeaways
          - A conversation starter or question to engage readers
          - Relevant hashtags
          
          Make it professional yet conversational.
          Focus on providing value to your network.
          Keep paragraphs short (2-3 lines max).
          Aim for around 200-300 words.
          End with a clear call-to-action.`,
                },
                {
                    role: "user",
                    content: researchSummary,
                },
            ],
        });

        return (
            completion.choices[0].message.content ||
            "Failed to generate LinkedIn post"
        );
    } catch (error) {
        console.error("Error generating LinkedIn post:", error);
        throw new Error("Failed to generate LinkedIn post");
    }
}
