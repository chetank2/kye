# KYE Data Analysis Workspace

A modern React + TypeScript application for analyzing Excel files with AI-powered insights. Built with Vite, Tailwind CSS, ShadCN UI, and Zustand.

## Features

- **File Upload**: Drag & drop Excel files (.xlsx) for analysis
- **Header Detection**: Automatically detects and maps common headers across multiple files
- **Manual Mapping**: Tools for manually mapping headers when automatic detection fails
- **Alias Management**: Define custom aliases for header groups
- **AI Chat Interface**: Interactive chat drawer for asking questions about your data
- **Data Visualization**: Built-in charts (bar, line, pie) powered by Recharts
- **Dark/Light Theme**: Toggle between light and dark modes with persistent preferences
- **Session Management**: Organize your analysis sessions

## Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Excel Parsing**: xlsx
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # ShadCN UI components
│   ├── sidebar/         # Session sidebar
│   ├── file-dropzone/   # File upload component
│   ├── file-table/      # File list and header table
│   ├── header-mapping/  # Header mapping interface
│   ├── alias-editor/    # Alias definition editor
│   ├── analysis-loader/ # Analysis trigger component
│   ├── chat-drawer/     # Chat interface drawer
│   ├── charts/          # Chart components
│   └── theme/           # Theme components
├── libs/                # Utility functions
│   ├── excel-parser.ts
│   ├── find-common-headers.ts
│   ├── alias-logic.ts
│   ├── chart-export.ts
│   └── utils.ts
├── pages/               # Page components
│   └── workspace.tsx
├── store/               # Zustand stores
│   ├── useWorkspaceStore.ts
│   └── useThemeStore.ts
├── App.tsx
└── main.tsx
```

## Theme Configuration

The application supports both light and dark themes with automatic persistence.

### Using the Theme Toggle

- Click the sun/moon icon in the sidebar header to toggle between light and dark modes
- Your theme preference is automatically saved to localStorage
- The theme persists across page reloads

### Theme Implementation

The theme system uses:
- **Zustand Store**: `useThemeStore` manages theme state
- **Theme Provider**: `ThemeProvider` component applies theme classes
- **CSS Variables**: Tailwind CSS variables for theme-aware styling
- **localStorage**: Persists theme preference as `kye-theme`

### Customizing Themes

Theme colors are defined in `src/index.css` using CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme variables */
}
```

To customize colors, modify these variables in `src/index.css`.

## Usage

### Uploading Files

1. Drag and drop Excel files (.xlsx) onto the dropzone, or click to browse
2. Files are automatically processed and headers are extracted
3. Common headers across multiple files are automatically detected

### Mapping Headers

1. If files have different header names, use the Header Mapping interface
2. Group similar headers together
3. Define aliases for each header group

### Analyzing Data

1. After uploading files and mapping headers, click "Analyze Data with AI"
2. The chat drawer will open with an initial analysis
3. Ask questions about your data in the chat interface
4. View visualizations generated from your data

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configured for React + TypeScript
- Prettier formatting (if configured)

## Requirements Verification

See [VERIFICATION.md](./VERIFICATION.md) for a comprehensive checklist of all features and requirements.

## Known Limitations

- Mock LLM integration (no real AI backend)
- No backend API integration (all data in memory)
- No file persistence (files lost on refresh)
- No automated tests (manual testing only)

## Future Enhancements

- Real LLM API integration
- Backend API for data persistence
- Automated test suite
- File export functionality
- Advanced chart types
- Session export/import
- User authentication
- Multi-user collaboration

## License

Private project - All rights reserved
