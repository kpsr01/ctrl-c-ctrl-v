# Ctrl+C Ctrl+V: AI-Powered Document Generator

> Transform natural language into professional documents instantly using AI
> 🌐 **[Live Demo](https://presto-ai.vercel.app/)** | 

## Project Overview

Ctrl+C Ctrl+V is an intelligent document generation platform that leverages Google's Gemini AI to convert natural language descriptions into fully structured documents. Whether you need forms, presentations, or spreadsheets, simply describe what you want in plain English, and our AI will generate professional-quality documents that seamlessly integrate with Google Workspace. This eliminates the tedious manual work of document creation and enables users to focus on content rather than formatting.

## ✨ Features

### 🤖 AI-Powered Generation
- **Natural Language Processing**: Describe documents in plain English
- **Google Gemini Integration**: Powered by Google's advanced Gemini 2.5 Flash model
- **Context-Aware Editing**: Make iterative improvements through conversation
- **Intelligent Schema Creation**: Generates valid JSON schemas for all document types

### 📋 Multi-Format Support
- **Dynamic Forms**: Interactive forms with validation, multiple field types, and custom layouts
- **Professional Presentations**: Themed slideshows with custom layouts, colors, and fonts
- **Smart Spreadsheets**: Multi-sheet workbooks with headers, sample data, and formatting

### 🔗 Google Workspace Integration
- **Seamless Authentication**: One-click Google OAuth login
- **Direct Publishing**: Automatically creates documents in Google Forms, Slides, and Sheets
- **Real-time Collaboration**: Edit and share through Google's native interfaces
- **Cloud Synchronization**: All documents saved directly to your Google Drive

### 🎨 Modern User Experience
- **Intuitive Chat Interface**: Conversational document creation
- **Live Preview**: See your documents as they're being generated
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth, engaging user interface with modern styling

### 🛡️ Enterprise-Ready
- **Secure Authentication**: Google OAuth 2.0 integration
- **Error Handling**: Comprehensive error management and user feedback
- **Rate Limiting**: Built-in API rate limiting and quota management
- **Scalable Architecture**: Modular design for easy expansion

## 🚀 Installation Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Google Cloud Project** with enabled APIs
- **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ctrl-c-ctrl-v.git
cd ctrl-c-ctrl-v
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```bash
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google OAuth (add to your frontend environment)
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 4. Configure Google Cloud APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Forms API
   - Google Slides API
   - Google Sheets API
   - Google Drive API
4. Create credentials (OAuth 2.0 Client ID)
5. Add your domain to authorized origins

### 5. Start the Application

**Development Mode (runs both frontend and backend):**
```bash
npm run start-all
```

**Or run separately:**

**Backend:**
```bash
npm run server
```

**Frontend:**
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 📖 Usage Examples

### Creating a Form
1. **Login**: Sign in with your Google account
2. **Select Type**: Choose "Form" from the sidebar
3. **Describe**: Type something like:
   ```
   Create a job application form with fields for name, email, 
   phone, resume upload, position applying for, years of experience, 
   and availability date
   ```
4. **Generate**: Watch as the AI creates your form
5. **Preview**: Review the form in the preview panel
6. **Publish**: Click "Create in Google Forms" to save to your Drive

### Building a Presentation
1. **Select PPT**: Choose presentation mode
2. **Add Theme**: Specify a theme (professional, creative, academic, etc.)
3. **Describe Content**:
   ```
   Create a marketing strategy presentation with slides for 
   market analysis, target audience, competitive landscape, 
   marketing channels, budget breakdown, and success metrics
   ```
4. **Customize**: Ask for modifications like "make it more colorful" or "add more slides about social media"
5. **Export**: Generate the presentation in Google Slides

### Generating a Spreadsheet
1. **Choose Spreadsheet**: Select the spreadsheet option
2. **Describe Structure**:
   ```
   Create a budget tracker with monthly expenses, income sources, 
   savings goals, and a summary dashboard with charts
   ```
3. **Refine**: Request changes like "add more expense categories" or "include a yearly summary"
4. **Create**: Export to Google Sheets with all formulas and formatting

### Editing Existing Documents
- **Iterative Improvement**: Make changes by describing what you want to modify
- **Context Preservation**: The AI remembers your previous requests
- **Version Control**: Each edit builds upon the previous version

## 🛠️ Technologies Used

### Frontend
- **React 19** - Modern UI framework with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **React JSON Schema Form** - Dynamic form generation
- **Google OAuth** - Secure authentication
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Google Generative AI SDK** - Gemini AI integration
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

### External Services
- **Google Gemini 2.5 Flash** - Advanced language model
- **Google Forms API** - Form creation and management
- **Google Slides API** - Presentation generation
- **Google Sheets API** - Spreadsheet creation
- **Google OAuth 2.0** - User authentication
- **Google Drive API** - File storage and management

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Concurrently** - Run multiple commands simultaneously
- **Nodemon** - Development server auto-restart

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve Ctrl+C Ctrl+V:

### Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a new branch for your feature or fix
4. **Install** dependencies and set up your development environment

### Development Workflow
1. **Branch Naming**: Use descriptive branch names (`feature/ai-improvements`, `fix/auth-bug`)
2. **Code Style**: Follow the existing code style and run ESLint before committing
3. **Testing**: Test your changes thoroughly with different document types
4. **Documentation**: Update documentation for any new features

### Pull Request Process
1. **Commit Messages**: Write clear, descriptive commit messages
2. **Description**: Provide a detailed description of your changes
3. **Testing**: Include information about how you tested your changes
4. **Screenshots**: Include screenshots for UI changes

### Areas for Contribution
- **AI Prompt Engineering**: Improve prompt templates for better generation
- **UI/UX Enhancements**: Design improvements and new features
- **API Integrations**: Add support for more document types or services
- **Performance Optimization**: Speed improvements and caching
- **Documentation**: Help improve guides and examples
- **Bug Fixes**: Fix issues and improve error handling

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow best practices for open source development

## 📄 License

This project is licensed under the MIT License - see the details below:

```
MIT License

Copyright (c) 2024 Ctrl+C Ctrl+V

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🔗 Links and Resources

- **🌐 Live Demo**: [Coming Soon]
- **📖 Documentation**: [Wiki](https://github.com/yourusername/ctrl-c-ctrl-v/wiki)
- **🐛 Issues**: [Bug Reports](https://github.com/yourusername/ctrl-c-ctrl-v/issues)
- **💬 Discussions**: [Community Forum](https://github.com/yourusername/ctrl-c-ctrl-v/discussions)

## 🙏 Acknowledgments

- **Google AI Team** for the powerful Gemini API
- **React Community** for the excellent ecosystem
- **Open Source Contributors** who make projects like this possible

---

**Made with ❤️ by the Ctrl+C Ctrl+V Team**

*Transform your ideas into documents instantly!*
