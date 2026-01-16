# Deployment Guide - Spotpanel with Admin Dashboard

This guide will help you deploy your Spotpanel application with the new Admin Dashboard to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A GitHub account (for version control)
2. A Vercel account (free at https://vercel.com)
3. Your project code ready (already prepared)

## Step 1: Push Your Project to GitHub

### 1.1 Initialize Git Repository

```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit: Add admin dashboard and session management"
```

### 1.2 Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `spotpanel`)
3. Do NOT initialize with README, .gitignore, or license
4. Click "Create repository"

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/spotpanel.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### 2.1 Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository (`spotpanel`)
4. Click "Import"

### 2.2 Configure Project Settings

On the "Configure Project" page:

- **Project Name**: `spotpanel` (or your preferred name)
- **Framework Preset**: Next.js (should be auto-detected)
- **Root Directory**: `.` (current directory)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 2.3 Add Environment Variables

Click "Environment Variables" and add:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
API_URL=https://your-project-name.vercel.app/api/control
NODE_ENV=production
```

**Note**: Replace `your-project-name` with your actual Vercel project name.

### 2.4 Deploy

Click "Deploy" and wait for the deployment to complete (usually 2-5 minutes).

## Step 3: Access Your Deployment

Once deployment is complete, you'll have:

- **Main Application**: `https://your-project-name.vercel.app`
- **Admin Dashboard**: `https://your-project-name.vercel.app/admin`
- **Blocked Page**: `https://your-project-name.vercel.app/blocked`

### Admin Dashboard Access

- **URL**: `https://your-project-name.vercel.app/admin`
- **Password**: `weareme`

## Step 4: Session Storage Configuration

The application uses a JSON file (`sessions.json`) to store active user sessions. This file is created automatically in the project root.

### Important Notes:

- **File Persistence**: On Vercel, the `sessions.json` file will be created but may not persist across deployments or function restarts due to the serverless nature of Vercel.
- **For Production Use**: Consider implementing a database-backed solution (MongoDB, Firebase, etc.) for persistent session storage.

## Step 5: Testing Your Deployment

1. Open your deployed application: `https://your-project-name.vercel.app`
2. Navigate through the application to generate a session
3. Open the admin dashboard: `https://your-project-name.vercel.app/admin`
4. Enter the password: `weareme`
5. You should see your active session in the dashboard
6. Test the redirect and block features

## Updating Your Deployment

To update your deployed application:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically redeploy your application when you push to the main branch.

## Troubleshooting

### Issue: Admin Dashboard shows no sessions

**Possible Causes**:
- Sessions file not persisting on Vercel
- No active user sessions

**Solution**: 
- Open the main application first to generate a session
- Refresh the admin dashboard

### Issue: Redirect/Block commands not working

**Possible Causes**:
- Session data not being saved properly
- Vercel serverless function timeout

**Solution**:
- Implement a database-backed session store (see Advanced section below)

### Issue: Build fails on Vercel

**Possible Causes**:
- Missing environment variables
- Dependency issues

**Solution**:
- Check Vercel build logs for specific errors
- Ensure all required environment variables are set
- Run `npm install` locally to verify dependencies

## Advanced: Database-Backed Session Storage

For production use, replace the JSON file storage with a database:

### Option 1: MongoDB Atlas (Recommended for Vercel)

1. **Create MongoDB Atlas Account**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Create a new cluster
   - Get your connection string

2. **Update Session Store**:
   - Install MongoDB driver: `npm install mongodb`
   - Update `lib/session-store.ts` to use MongoDB instead of JSON file

3. **Add Environment Variable to Vercel**:
   - Add `MONGODB_URI=your_connection_string` to Vercel environment variables

### Option 2: Firebase Realtime Database

1. **Create Firebase Project**:
   - Go to https://firebase.google.com
   - Create a new project
   - Enable Realtime Database
   - Get your database URL and credentials

2. **Install Firebase SDK**:
   ```bash
   npm install firebase-admin
   ```

3. **Update Session Store** to use Firebase

4. **Add Environment Variables** to Vercel

## Security Considerations

1. **Admin Password**: The password `weareme` is stored in the code. For production, consider:
   - Using environment variables for the password
   - Implementing OAuth or other authentication methods
   - Using HTTPS (Vercel provides this by default)

2. **Session Data**: Ensure sensitive data is not stored in sessions

3. **API Endpoints**: Consider adding rate limiting and authentication to admin API endpoints

## Performance Optimization

1. **Enable Caching**: Configure Vercel caching for static assets
2. **Monitor Usage**: Use Vercel Analytics to monitor performance
3. **Optimize Images**: Ensure all images are optimized
4. **Database Indexing**: If using a database, add appropriate indexes

## Support

For issues with:
- **Vercel Deployment**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

## Summary

Your Spotpanel application with the Admin Dashboard is now ready for production deployment on Vercel. The admin dashboard allows you to:

- Monitor all active user sessions in real-time
- See which page each user is currently viewing
- Redirect users to specific URLs
- Block users from accessing the application
- Delete user sessions

All features are protected by the password `weareme`.
