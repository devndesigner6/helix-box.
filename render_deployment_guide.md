# Render Deployment Guide for Helixbox Backend

This guide walks you through deploying the `manager` (control plane) and `proxy` (WebSocket relay) servers on [Render.com](https://render.com).

---

## 1. Prepare Dockerfiles (Completed)
We have already created Dockerfiles in the subdirectories:
* [manager/Dockerfile](file:///c:/Users/hp/open%20ai%20hack/lunel/manager/Dockerfile)
* [proxy/Dockerfile](file:///c:/Users/hp/open%20ai%20hack/lunel/proxy/Dockerfile)

---

## 2. Step-by-Step Render.com Setup

You will deploy both components as **Web Services** on Render.

### Service A: Deploy the Manager (`manager.helixbox.xyz`)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository `devndesigner6/helix-box.`.
4. Configure the Web Service:
   * **Name**: `helixbox-manager`
   * **Language**: `Docker`
   * **Docker Build Context**: `.` *(Leave as default repository root)*
   * **Docker File Path**: `manager/Dockerfile`
   * **Branch**: `main`
5. Under **Advanced Options** -> **Environment Variables**, add:
   * `PORT`: `8080`
   * `MANAGER_ADMIN_PASSWORD`: `your_secure_admin_password` *(Required: Password to access the manager dashboard)*
   * `PROXIES`: `https://gateway.helixbox.xyz` *(Optional: whitelist of authorized proxies)*
6. Click **Deploy Web Service**. Render will build and spin up the container at `https://helixbox-manager.onrender.com`.

### Service B: Deploy the Proxy (`gateway.helixbox.xyz`)
1. In Render, click **New +** -> **Web Service**.
2. Connect your GitHub repository `devndesigner6/helix-box.`.
3. Configure the Web Service:
   * **Name**: `helixbox-proxy`
   * **Language**: `Docker`
   * **Docker Build Context**: `.` *(Leave as default repository root)*
   * **Docker File Path**: `proxy/Dockerfile`
   * **Branch**: `main`
4. Under **Advanced Options** -> **Environment Variables**, add:
   * `PORT`: `3000`
   * `MANAGER_URL`: `https://helixbox-manager.onrender.com` *(Required: URL of the manager service you just created)*
   * `PROXY_PASSWORD`: `your_secure_proxy_password` *(Required: Password for communicating with the manager)*
   * `PUBLIC_URL`: `https://gateway.helixbox.xyz` *(Required: The public URL of the proxy)*
5. Click **Deploy Web Service**. Render will build and spin up the container at `https://helixbox-proxy.onrender.com`.

---

## 3. Custom Domain Mapping

Once the services are deployed, map them to your domain `helixbox.xyz` on Render:
1. In the Render Dashboard, open the `helixbox-manager` web service.
2. Go to **Settings** -> **Custom Domains** -> **Add Custom Domain**.
3. Add `manager.helixbox.xyz`.
4. Follow Render's prompts to add a **CNAME** record in your DNS settings (GoDaddy, Cloudflare, etc.) pointing `manager.helixbox.xyz` to `helixbox-manager.onrender.com`.
5. Repeat the same steps for the `helixbox-proxy` web service, mapping `gateway.helixbox.xyz` CNAME to `helixbox-proxy.onrender.com`.

---

## 4. End-to-End WebSocket Testing
* Secure WebSocket (`wss://`) and Secure HTTPS (`https://`) are automatically enabled by Render's TLS certificates.
* Clients (App & CLI) will now be able to communicate securely over `wss://gateway.helixbox.xyz` and `https://manager.helixbox.xyz`.
