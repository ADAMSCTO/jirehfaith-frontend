package com.jirehfaith.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set window/decor backgrounds to royal purple BEFORE super creates the WebView
    Window w = getWindow();
    if (w != null) {
      int purple = Color.parseColor("#6C3BAA");
      w.setBackgroundDrawable(null);        // remove any drawable that could be dark/black
      w.getDecorView().setBackgroundColor(purple);
    }

    super.onCreate(savedInstanceState);

    // Ensure the WebView itself starts purple (no white flash before CSS loads)
    try {
      WebView webView = getBridge().getWebView();
      if (webView != null) {
        int purple = Color.parseColor("#6C3BAA");
        webView.setBackgroundColor(purple);
        // Also guard the root view just in case
        View root = webView.getRootView();
        if (root != null) {
          root.setBackgroundColor(purple);
        }
      }
    } catch (Exception ignored) {}
  }
}
