# TypeSpeed - Test Your Typing Speed

A modern, responsive typing speed test application built with React, TypeScript, and Tailwind CSS. Test and improve your typing skills with real-time feedback, detailed statistics, and a beautiful user interface.

## 🚀 Features

- **Real-time Typing Test**: Accurate WPM (Words Per Minute) calculation with live feedback
- **Customizable Time Limits**: Choose from 15s, 30s, 60s, or 120s test durations
- **Detailed Statistics**: Track your best WPM, average WPM, and total tests completed
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable typing in any environment
- **Local Storage**: Your progress and statistics are saved locally
- **Clean UI**: Minimalist design that focuses on the typing experience
- **Keyboard Support**: Full keyboard navigation and shortcuts
- **Error Tracking**: Visual feedback for correct and incorrect characters

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Routing**: React Router DOM
- **State Management**: React hooks and custom hooks
- **Theme Management**: next-themes for dark/light mode
- **Notifications**: Sonner for toast notifications

## 📦 Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, or bun package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 🎯 How to Use

1. **Start a Test**: Click the "Start Test" button or simply start typing
2. **Choose Duration**: Select your preferred test duration (15s, 30s, 60s, or 120s)
3. **Type Away**: Type the displayed words as accurately and quickly as possible
4. **View Results**: After the test completes, see your WPM, accuracy, and other statistics
5. **Track Progress**: Your statistics are automatically saved and displayed in the stats cards
6. **Theme Toggle**: Use the theme toggle in the header to switch between light and dark modes

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Main navigation header
│   │   └── Footer.tsx          # Application footer
│   ├── stats/
│   │   └── StatsCards.tsx      # Statistics display cards
│   ├── ui/                     # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── ThemeToggle.tsx         # Theme switching component
│   ├── TypingDisplay.tsx       # Word display and input interface
│   └── TypingTest.tsx          # Main typing test component
├── hooks/
│   └── useTypingTest.ts        # Custom hook for typing test logic
├── lib/
│   └── utils.ts                # Utility functions
├── pages/
│   ├── Index.tsx               # Main application page
│   └── NotFound.tsx            # 404 error page
├── providers/
│   └── ThemeProvider.tsx       # Theme context provider
├── utils/
│   └── storage.ts              # Local storage utilities
├── App.tsx                     # Main app component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles and design tokens
```

## 🎨 Design System

The application uses a comprehensive design system built with Tailwind CSS:

- **Color Palette**: Semantic color tokens for consistent theming
- **Typography**: Responsive typography scale
- **Spacing**: Consistent spacing system
- **Components**: Reusable UI components with variants
- **Dark Mode**: Full dark mode support with automatic theme detection

## 📊 Features in Detail

### Typing Test Engine
- Real-time character-by-character validation
- Accurate WPM calculation based on standard 5-character word length
- Backspace support with error correction
- Dynamic word generation for varied test content

### Statistics Tracking
- **Best WPM**: Highest typing speed achieved
- **Average WPM**: Mean typing speed across all tests
- **Total Tests**: Number of completed typing tests
- **Local Persistence**: Statistics saved automatically

### Responsive Design
- Mobile-first approach with touch-friendly interface
- Adaptive layout for different screen sizes
- Optimized keyboard handling for mobile devices

## 🚀 Performance Features

- **Vite Build System**: Fast development and optimized production builds
- **Code Splitting**: Automatic code splitting for optimal loading
- **Tree Shaking**: Unused code elimination
- **Modern JavaScript**: ES2022+ features with proper browser support
- **Optimized Assets**: Compressed and optimized static assets

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build production version
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint for code quality checks

### Code Quality

The project maintains high code quality through:
- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component-based architecture
- Custom hooks for logic separation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📧 Support

If you have any questions or need help, please open an issue on the GitHub repository.

---

Built with ❤️ by [Aditya Kumar Gupta](mailto:aditya.rakesh.2005@gmail.com)