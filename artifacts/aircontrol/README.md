# AirControl

AirControl is a native Android React Native app (React Native CLI, not Expo). The phone UI is shared with the browser preview through React Native Web. Gesture recognition is not implemented; the app does not start a camera feed or claim to detect hands.

## Preview the interface

Open the AirControl preview in Replit. The preview runs the shared React Native screens in a browser; Android-only camera permission prompts are available only in an installed Android build.

## Build an installable APK

This project includes a GitHub Actions workflow in the repository root at `.github/workflows/aircontrol-android.yml`. Push or sync the project to a GitHub repository, open **Actions → Build AirControl Android APK → Run workflow**, then download the `aircontrol-android-apk` artifact when the run finishes.

The workflow creates a release-variant APK signed with the template debug key for testing and direct installation. It is not a production or Play Store signing setup. Use a private upload key and protected CI secrets before distributing a production release.
