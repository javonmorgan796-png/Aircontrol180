package com.aircontrol

import android.app.Application
import android.content.Intent
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import java.io.File
import java.io.FileWriter
import java.io.PrintWriter
import java.io.StringWriter

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean =
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()

    // Install a default uncaught exception handler that saves the stacktrace to a file
    // and launches a simple activity so you can copy/share the crash text from the device.
    Thread.setDefaultUncaughtExceptionHandler { thread, e ->
      val sw = StringWriter()
      e.printStackTrace(PrintWriter(sw))
      val stack = sw.toString()

      try {
        val f = File(filesDir, "crash.txt")
        FileWriter(f, true).use { it.write(stack + "\n\n") }
      } catch (_: Exception) {}

      try {
        val intent = Intent(applicationContext, CrashReportActivity::class.java).apply {
          putExtra("stacktrace", stack)
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        }
        startActivity(intent)
      } catch (_: Exception) {}

      android.os.Process.killProcess(android.os.Process.myPid())
      System.exit(1)
    }

    loadReactNative(this)
  }
}
