# 🚀 Supabase Setup Guide for Tony Properties

This guide will help you set up Supabase for your Tony Properties real estate project.

## 📋 **Step 1: Create Supabase Account**

1. **Visit** [supabase.com](https://supabase.com)
2. **Click "Start your project"**
3. **Sign up** with GitHub (recommended) or email
4. **Create a new project**

## 🔧 **Step 2: Project Setup**

1. **Choose organization** (create one if needed)
2. **Project name**: `tony-properties`
3. **Database password**: Create a strong password (save it!)
4. **Region**: Choose closest to your users
5. **Click "Create new project"**

## 🗄️ **Step 3: Database Schema**

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-schema.sql`
3. **Click "Run"** to create all tables and functions

## 🔑 **Step 4: Get API Keys**

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values**:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## ⚙️ **Step 5: Environment Variables**

1. **Create/update** `.env.local` in your project root:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Keep your existing Cloudinary config
CLOUDINARY_CLOUD_NAME=tony-properties
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🚀 **Step 6: Test Connection**

1. **Start your dev server**:
```bash
npm run dev
```

2. **Check browser console** for any Supabase connection errors

## 📊 **Step 7: Migrate Data**

1. **Run the migration script**:
```bash
npm run migrate-to-supabase
```

2. **Check Supabase dashboard** to see your data

## 🎯 **What You Get:**

### **✅ Database Features:**
- **10 Properties** with full details
- **Property Images** linked to Cloudinary
- **Amenities** with smart linking
- **Full-text Search** for properties
- **Real-time Updates** across all users

### **✅ Performance Features:**
- **Optimized Indexes** for fast queries
- **Search Vector** for text search
- **Foreign Key Relationships** for data integrity
- **Row Level Security** for future auth

### **✅ Scalability:**
- **PostgreSQL** database (industry standard)
- **Auto-scaling** infrastructure
- **Backup & Recovery** included
- **Monitoring & Analytics** built-in

## 🔍 **Verify Setup:**

1. **Check Supabase Dashboard**:
   - Tables → should see `properties`, `property_images`, `amenities`, `property_amenities`
   - Data → should see your 10 properties

2. **Test Search Function**:
   - Go to SQL Editor
   - Run: `SELECT * FROM properties_search('apartment');`

## 🚨 **Troubleshooting:**

### **Connection Issues:**
- Verify environment variables are correct
- Check if Supabase project is active
- Ensure API keys are copied correctly

### **Migration Errors:**
- Check if schema was created successfully
- Verify table names match exactly
- Check for duplicate data (slugs must be unique)

### **Data Not Showing:**
- Check Row Level Security policies
- Verify data was inserted correctly
- Check browser console for errors

## 📱 **Next Steps:**

1. **Update Admin Panel** to use Supabase
2. **Create API Routes** for CRUD operations
3. **Add Real-time Features** for live updates
4. **Implement Search** using full-text search
5. **Add Authentication** for admin access

## 🆘 **Need Help?**

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Discord Community**: [supabase.com/discord](https://supabase.com/discord)
- **GitHub Issues**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

---

**🎉 Congratulations!** Your Tony Properties project now has a professional, scalable database backend with Supabase!
