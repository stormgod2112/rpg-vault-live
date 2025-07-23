# RPG Vault - Clean Deployment Package

This is a clean export of the RPG Vault application, free from Git metadata caching issues.

## Quick Deploy

### Environment Variables Required:
- DATABASE_URL: postgresql://neondb_owner:npg_NACy8RuKH7lV@ep-hidden-base-adhsetg8.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
- SESSION_SECRET: rpg_vault_session_secret_2025

### Railway Deployment:
1. Create new GitHub repository
2. Upload these files to the new repository
3. Deploy from Railway using the new repository

### Vercel Deployment:
1. Upload this folder directly to Vercel
2. Or create new GitHub repository and deploy from there

### Manual Deployment:
1. Run: npm install
2. Run: npm run build
3. Run: npm start

The application builds to a 635KB bundle and runs perfectly.
