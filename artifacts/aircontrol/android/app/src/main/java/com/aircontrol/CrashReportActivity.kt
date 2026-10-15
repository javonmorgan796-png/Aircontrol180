package com.aircontrol

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.io.File

class CrashReportActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crash_report)

        val tv: TextView = findViewById(R.id.crash_text)
        val shareBtn: Button = findViewById(R.id.share_btn)
        val copyBtn: Button = findViewById(R.id.copy_btn)
        val saveBtn: Button = findViewById(R.id.save_btn)

        // Prefer stacktrace passed via intent but fall back to saved file if present
        val intentStack = intent.getStringExtra("stacktrace")
        if (!intentStack.isNullOrEmpty()) {
            tv.text = intentStack
        } else {
            tv.text = readSavedCrashText() ?: "No stacktrace available"
        }

        shareBtn.setOnClickListener {
            val text = tv.text.toString()
            val send = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_TEXT, text)
            }
            startActivity(Intent.createChooser(send, "Share crash text"))
        }

        copyBtn.setOnClickListener {
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = ClipData.newPlainText("crash", tv.text.toString())
            clipboard.setPrimaryClip(clip)
        }

        saveBtn.setOnClickListener {
            // copy crash text into external files so it's easy to fetch with a file manager
            try {
                val external = getExternalFilesDir(null)
                if (external != null) {
                    val out = File(external, "crash_shared.txt")
                    out.writeText(tv.text.toString())
                }
            } catch (_: Exception) { }
        }
    }

    private fun readSavedCrashText(): String? {
        return try {
            val f = File(filesDir, "crash.txt")
            if (f.exists()) f.readText() else null
        } catch (_: Exception) {
            null
        }
    }
}
