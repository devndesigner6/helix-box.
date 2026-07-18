# Vercel Deployment Guide for Helixbox Web IDE

This guide walks you through deploying the **Helixbox Web IDE application** (the actual frontend client compiled from the `app/` folder) to [Vercel](https://vercel.com).

---

## 1. How it works
* The `app/` folder is built using React Native/Expo.
* Expo supports compiling the app for the Web platform (`npx expo export`), which compiles your React Native screens (file explorer, terminals, and settings) into clean static HTML/JS web assets.
* By deploying the `app/` folder to Vercel, visiting `https://helixbox.xyz` will directly load the Web IDE, allowing users to input pairing codes and work in their browser.

---

## 2. Deploying on Vercel Dashboard

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** and select **Project**.
3. Import your GitHub repository: `devndesigner6/helix-box.`.
4. Configure the project settings:
   * **Project Name**: `helixbox-web-ide`
   * **Framework Preset**: Select **Other** (or **Expo** if Vercel automatically detects it).
   * **Root Directory**: Click *Edit* and select the **`app`** folder. *(Crucial: This tells Vercel to compile only the React Native client)*
5. **Build and Output Settings** (usually detected automatically, but verify):
   * **Build Command**: `npx expo export` (or `npm run build` if configured)
   * **Output Directory**: `dist` (Expo's static export folder)
6. Click **Deploy**. Vercel will download the code, compile the React Native views for the web, and publish it.

---

## 3. Map your Custom Domain (`helixbox.xyz`)

Once deployed, link your domain so visiting the root of your domain launches the IDE:
1. In Vercel, open your project -> **Settings** -> **Domains**.
2. Add your apex domain `helixbox.xyz` and/or `www.helixbox.xyz`.
3. Vercel will prompt you to configure the DNS records:
   * A record for `helixbox.xyz` pointing to Vercel's IP.
   * CNAME record for `www.helixbox.xyz` pointing to `cname.vercel-dns.com`.
