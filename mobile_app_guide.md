# Mobile App Build and Distribution Guide (GitHub Downloads)

This guide walks you through compiling your React Native/Expo app into a standalone Android APK and hosting it directly on your GitHub Releases page so anyone can download and install it.

---

## 1. Prerequisites
Before building, make sure you have:
1. An account on [Expo](https://expo.dev) (it is free).
2. Node.js installed on your machine.
3. Installed the EAS Command Line Interface (CLI):
   ```bash
   npm install -g eas-cli
   ```

---

## 2. Compile the Android APK

Expo Application Services (EAS) will handle the build process completely in the cloud, so you don't need to configure Android Studio.

1. **Log in to Expo**:
   ```bash
   eas login
   ```
2. **Initialize EAS Project**:
   Run this inside the [`app/`](file:///c:/Users/hp/open%20ai%20hack/lunel/app) folder to associate the app with your Expo account:
   ```bash
   cd app
   eas project:init
   ```
   *This command will automatically assign a new `projectId` and append it to your `app.json`.*

3. **Configure EAS Build**:
   Ensure your `eas.json` is set up. You can generate a basic configuration by running:
   ```bash
   eas build:configure
   ```
   Verify that your `eas.json` has a `"preview"` or `"production"` profile with `"buildType": "apk"` (to output a standard installable file instead of an `.aab` Google Play bundle):
   ```json
   {
     "cli": {
       "version": ">= 10.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {}
     }
   }
   ```

4. **Trigger the Android Build**:
   Run the following command to start the compile process:
   ```bash
   eas build --platform android --profile preview
   ```
5. **Download the APK**:
   * EAS will build the app in the cloud.
   * Once finished, the terminal will print a direct download URL.
   * Open the link in your browser and download the `.apk` file (e.g. `helixbox.apk`).

---

## 3. Host and Distribute on GitHub Releases

Now that you have the `.apk` file, you can upload it to your GitHub repository for public downloads.

1. Go to your repository page: `https://github.com/devndesigner6/helix-box`.
2. On the right-hand sidebar, click **Releases** -> **Create a new release** (or click **Draft a new release**).
3. Fill in the release details:
   * **Tag version**: e.g., `v1.0.0`
   * **Target branch**: `main`
   * **Release title**: `Helixbox v1.0.0 (Beta)`
   * **Description**: Write a short note describing the release (e.g. "Welcome to Helixbox. Code on your phone, run on your computer!").
4. **Upload the Asset**:
   * Drag and drop the downloaded `helixbox.apk` file into the box marked *“Attach binaries by dropping them here or selecting them”*.
5. Click **Publish release**.

---

## 4. How Users Install the App
1. Users visit your GitHub repository page, go to **Releases**, and click on the `helixbox.apk` asset link.
2. They download the file on their Android phone.
3. They open the file. (Android may prompt them to "Allow installation from unknown sources" since it is not downloaded directly from the Play Store. They should tap **Allow** / **Settings -> Allow from this source** to complete the installation).
