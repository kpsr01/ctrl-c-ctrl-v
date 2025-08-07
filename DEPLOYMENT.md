# Vercel Deployment Guide

## Pre-deployment Setup

### 1. Install Vercel CLI (if you haven't already)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

## Deployment Steps

### 1. Deploy from your project directory
```bash
cd your-project-folder
vercel
```

### 2. Configure Environment Variables in Vercel Dashboard
Go to your Vercel project dashboard and add these environment variables:

**Required Environment Variables:**
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `OPENROUTER_API_URL`: https://openrouter.ai/api/v1
- `NODE_ENV`: production

### 3. Redeploy after setting environment variables
```bash
vercel --prod
```

## Alternative: Deploy via GitHub

### 1. Push your code to GitHub
```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### 2. Connect GitHub to Vercel
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration

### 3. Set Environment Variables
In the Vercel dashboard:
1. Go to your project
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add the required variables listed above

## Project Structure for Vercel

```
your-project/
├── api/                    # Serverless functions
│   ├── generate-schema.js  # Main API endpoint
│   └── health.js          # Health check endpoint
├── src/                   # Frontend React app
├── public/               # Static assets
├── vercel.json          # Vercel configuration
├── vite.config.js       # Vite build configuration
└── package.json         # Dependencies and scripts
```

## Key Changes Made

1. **Converted Express server to Vercel serverless functions** in `/api` directory
2. **Updated API service** to use relative URLs in production
3. **Added Vercel configuration** in `vercel.json`
4. **Updated Vite config** for optimized builds
5. **Added deployment scripts** to package.json

## Testing Locally

### Test the API functions locally:
```bash
vercel dev
```

This will start a local Vercel development server that simulates the serverless environment.

## Important Notes

- The `server/` directory is now unused and can be removed after successful deployment
- All backend logic is now in the `/api` directory as serverless functions
- Environment variables must be set in Vercel dashboard for production
- The app will automatically use relative URLs for API calls in production

## Troubleshooting

### If you get CORS errors:
- Make sure the environment variables are set correctly in Vercel
- Check that the API functions include proper CORS headers (they do in this setup)

### If the build fails:
- Check the Vercel function logs in the dashboard
- Ensure all dependencies are in package.json (not just devDependencies)

### If the API doesn't work:
- Verify your OpenRouter API key is valid and has credits
- Check the Vercel function logs for detailed error messages
