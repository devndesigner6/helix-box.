# Helixbox Deployment: Master Roadmap & Next Steps

This file details all the remaining steps you need to follow to take **Helixbox** completely live on your domain **`helixbox.xyz`** within your 2-hour window.

---

## 📋 The Complete Checklist

### 1. Connect Proxy to Manager (Control Plane)
Your backend servers are already successfully running on Render! Now you need to pair them:
* Visit your secret Manager dashboard in your browser:  
  👉 **`https://helixbox-manager.onrender.com/oldschooladmin`**
* Log in using your `MANAGER_ADMIN_PASSWORD`:  
  🔑 **`qkaFPYWNEcwhVyZnOjCQHSoM7AmpDi6U`**
* Click **"Add Proxy"** and register your proxy server:
  * **Proxy URL**: `https://helixbox-proxy.onrender.com`
  * **Proxy Password**: The `PROXY_PASSWORD` you set in the Render environment variables for the proxy (e.g., `PGosgdxRKJc1aUFVMSDZmB4qXpYnt2re`).

---

### 2. Configure Domain DNS Records
Log into your domain registrar (GoDaddy, Namecheap, etc.) and add the following records to link `helixbox.xyz` to your hosting servers:

| Host / Name | Type | Points To (Target) | Purpose |
| :--- | :--- | :--- | :--- |
| `@` (or blank) | A | `76.76.21.21` *(Vercel IP)* | Point main website `helixbox.xyz` to your Frontend IDE |
| `www` | CNAME | `cname.vercel-dns.com` | Redirect www traffic to Vercel |
| `manager` | CNAME | `helixbox-manager.onrender.com` | Access your Control Plane dashboard |
| `gateway` | CNAME | `helixbox-proxy.onrender.com` | Direct connection gateway for App & CLI tunnels |

---

### 3. Deploy the Web IDE to Vercel
To host the actual interactive Web IDE at your main domain `https://helixbox.xyz`:
* Log in to [Vercel](https://vercel.com) and click **"Add New..."** -> **"Project"**.
* Import your GitHub repository: `devndesigner6/helix-box.`.
* In the configuration, click **Edit** on **Root Directory** and select the **`app`** folder.
* Leave the Framework Preset as default/other (Vercel runs `npx expo export` automatically).
* Click **Deploy**.
* Once live, go to **Settings** -> **Domains** in your Vercel project, and add `helixbox.xyz`.

---

### 4. Build and Distribute the Android Mobile App
To let users download the app from your GitHub repository releases:
* Open a terminal on your computer and go to the mobile app folder:
  ```bash
  cd app
  ```
* Log in to your Expo account (create one for free on [expo.dev](https://expo.dev) if you haven't):
  ```bash
  eas login
  ```
* Connect the project with your account:
  ```bash
  eas project:init
  ```
* Start the cloud compilation for the Android APK:
  ```bash
  eas build --platform android --profile preview
  ```
* Once completed, copy the generated `.apk` download URL from the terminal, download the file, and upload it as a release asset in **Releases -> Create a new release** on your GitHub repository page: `https://github.com/devndesigner6/helix-box.`.

---

### 5. Publish the CLI (Optional)
To make the CLI globally installable via `npx helixbox-cli` or `npm i -g helixbox-cli` for anyone:
* Navigate to the CLI directory:
  ```bash
  cd cli
  ```
* Log in to your npm account:
  ```bash
  npm login
  ```
* Publish the package:
  ```bash
  npm publish --access public
  ```

---

## 📂 Referenced Guides in Repository
If you need in-depth step-by-step help for any of these, open their respective files:
* **[render_deployment_guide.md](file:///c:/Users/hp/open%20ai%20hack/lunel/render_deployment_guide.md)** — Backend Render environment configurations.
* **[vercel_deployment_guide.md](file:///c:/Users/hp/open%20ai%20hack/lunel/vercel_deployment_guide.md)** — Frontend Vercel web configurations.
* **[mobile_app_guide.md](file:///c:/Users/hp/open%20ai%20hack/lunel/mobile_app_guide.md)** — Cloud compilation commands for the mobile client.
