# CareerAI - Your AI-Powered Career Development Platform

CareerAI helps you navigate your career journey with AI-powered insights, IKIGAI analysis, and professional content generation.

## Features

- **Smart Journaling**: Document your career journey with AI-powered summaries
- **IKIGAI Analysis**: Discover your career alignment through AI analysis of your journal entries
- **Build in Public**: Generate LinkedIn posts based on your IKIGAI insights
- **Progress Tracking**: Monitor your career development across key phases
- **Career Dashboard**: Visualize your growth with stats and recent activities

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: Tailwind CSS + shadcn/ui
- Backend: Node.js + Express
- AI: OpenAI API

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd careerai-ui
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory:
```env
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

4. Start the development servers:
```bash
# Start backend server
cd server
npm start

# In a new terminal, start frontend
npm run dev
```

5. Open http://localhost:8080 in your browser

## Project Structure

```
careerai-ui/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Page components
│   └── styles/        # CSS styles
├── server/
│   ├── index.js       # Express server
│   └── package.json   # Backend dependencies
└── package.json       # Frontend dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
