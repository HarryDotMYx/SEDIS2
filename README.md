# SEDCO Entrepreneur Database Information System

<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/building-2.svg" alt="SEDCO Logo" width="120" height="120" />

  <h3 align="center">Enterprise-Grade Entrepreneur Management System</h3>

  <p align="center">
    A comprehensive solution for managing SEDCO's entrepreneur database and business operations
  </p>
</div>

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/sedco-database.git
   cd sedco-database
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

### Production Build

1. Build the application
   ```bash
   npm run build
   ```

2. Preview the production build
   ```bash
   npm run preview
   ```

## 🎯 Features

### Core Features
- **Authentication & Authorization**
  - Secure login system
  - Role-based access control
  - Session management
  - Password security

- **Dashboard**
  - Real-time statistics
  - Visual analytics
  - Performance metrics
  - Recent activities

- **Entrepreneur Management**
  - Add/Edit/Delete entrepreneurs
  - Detailed profiles
  - Document management
  - Status tracking

- **Reports & Analytics**
  - Interactive charts
  - Data visualization
  - Export capabilities
  - Custom reporting

### Security Features
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Session security

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Recharts
- Lucide Icons

### State Management
- React Context API
- Custom Hooks

### Database
- SQL.js (Client-side)
- Structured data

### Development
- Vite
- ESLint
- TypeScript
- Prettier

## 📁 Project Structure

```
sedco-database/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components
│   │   ├── reports/     # Report components
│   │   └── entrepreneurs/ # Entrepreneur components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and database
│   ├── pages/           # Page components
│   └── types/           # TypeScript types
├── public/              # Static assets
└── dist/               # Production build
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=SEDCO Database
VITE_API_URL=your_api_url
```

### Development Configuration

Customize development settings in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
});
```

## 🚀 Deployment

1. Build the application
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting provider

### Supported Platforms
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📝 Development Guidelines

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Follow TypeScript best practices
- Use functional components
- Implement proper error handling

### Git Workflow

1. Create feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push changes
   ```bash
   git push origin feature/your-feature
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

Copyright © 2024 Perbadanan Pembangunan Ekonomi Sabah (SEDCO). All rights reserved.

## 📞 Support

For support and inquiries:

- Email: support@sedco.gov.my
- Phone: +60 88-XXXXXXX
- Website: https://www.sedco.gov.my

---

<div align="center">
  <sub>Built with ❤️ by SEDCO IT Team</sub>
</div>