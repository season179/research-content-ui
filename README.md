# Research Assistant & Content Writer

A modern web application that helps users conduct research and transform findings into various content formats.

## Features

- **Smart Research**: Enter any topic and get instant research results
- **Expandable Results**: Request additional research depth on demand
- **Content Generation**: Transform research into different content types:
  - Tweets
  - Blog Posts
  - Newsletters
  - LinkedIn Posts
- **Copy Functionality**: Easy one-click copying for all generated content
- **Modern UI**: Clean, responsive interface with smooth interactions

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/         # React components
│   ├── ArticleContent.tsx    # Article display component
│   ├── ArticleTypeModal.tsx  # Modal for selecting article type
│   ├── ResearchInput.tsx     # Search input component
│   └── ResearchResult.tsx    # Research results display
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Usage

1. Enter a research topic in the search bar
2. View the research results
3. Choose to:
   - Copy the research
   - Get more research depth
   - Generate content in various formats

## Roadmap

- [x] Add a buy me a pizza button
- [ ] Explore better UI/UX design
- [ ] Scroll to the content when it is loading
- [ ] Use AI to decide if more information can be gathered
- [ ] Use AI to decide if more information should be gathered
- [ ] Persist topic and results
- [ ] Export data
- [ ] Import data
- [ ] Allow user to bring their own research
