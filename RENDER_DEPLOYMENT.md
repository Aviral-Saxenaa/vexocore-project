# 🚀 Render Deployment Guide for VexoCore Task Manager

## 📋 Prerequisites
- ✅ GitHub repository connected
- ✅ Neon PostgreSQL database set up
- ✅ All code committed and pushed

## 🔧 Step 1: Prepare Your Repository

Your repository is already prepared with:
- ✅ `render.yaml` configuration file
- ✅ `package.json` with correct start script
- ✅ Backend code ready for production

## 🌐 Step 2: Deploy to Render

### 2.1 Go to Render Dashboard
1. Visit [render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click **"New +"** → **"Web Service"**

### 2.2 Connect Your Repository
1. **Connect your GitHub repository**: `Aviral-Saxenaa/vexocore-project`
2. **Select the repository** from the list
3. **Choose the branch**: `main`

### 2.3 Configure Your Service
Render will auto-detect the configuration from `render.yaml`, but verify:

**Basic Settings:**
- **Name**: `vexocore-task-manager-backend`
- **Environment**: `Node`
- **Region**: `Oregon` (or closest to you)
- **Branch**: `main`
- **Build Command**: `pnpm install`
- **Start Command**: `pnpm start`

**Environment Variables:**
You'll need to add these manually in Render dashboard:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secure-jwt-secret-key-2024
DB_CLIENT=postgresql
DB_HOST=ep-hidden-tooth-adygdcyo-pooler.c-2.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=npg_xQDtVNid6pm8
DB_NAME=neondb
DATABASE_URL=postgresql://neondb_owner:npg_xQDtVNid6pm8@ep-hidden-tooth-adygdcyo-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`pnpm install`)
   - Start your service (`pnpm start`)
   - Provide you with a URL

## 🔗 Step 3: Get Your Backend URL

After successful deployment, you'll get a URL like:
```
https://vexocore-task-manager-backend.onrender.com
```

**Save this URL** - you'll need it for the frontend!

## 🧪 Step 4: Test Your Backend

Test your deployed backend:

1. **Health Check**: `https://your-app-name.onrender.com/api/health`
2. **Should return**: `{"status":"ok","message":"VexoCore Task Manager API is running"}`

## 📱 Step 5: Update Frontend (Optional)

If you want to deploy the frontend too:

1. **Update API URL** in your frontend code
2. **Deploy frontend** to Vercel/Netlify
3. **Update API base URL** to point to your Render backend

## 🚨 Troubleshooting

### Common Issues:

**1. Build Fails**
- Check if `pnpm` is available (Render supports it)
- Verify `package.json` has correct scripts

**2. Service Won't Start**
- Check environment variables are set correctly
- Verify database connection (Neon credentials)
- Check Render logs for specific errors

**3. Database Connection Issues**
- Verify Neon database is running
- Check SSL settings in database config
- Ensure IP whitelist includes Render's IPs

**4. Port Issues**
- Render uses port 10000 by default
- Your app should listen on `process.env.PORT`

## ✅ Success Checklist

- [ ] Repository connected to Render
- [ ] Environment variables set correctly
- [ ] Service deployed successfully
- [ ] Health endpoint responding
- [ ] Database connected
- [ ] Backend URL saved

## 🔄 Next Steps After Deployment

1. **Test all API endpoints**
2. **Verify database operations**
3. **Check authentication flow**
4. **Monitor performance**
5. **Set up custom domain** (optional)

## 📞 Need Help?

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Check Render logs** for specific error messages
- **Verify environment variables** are set correctly
- **Test locally** with production environment variables

---

**Your VexoCore Task Manager backend will be live on Render! 🎉**
