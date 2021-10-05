package com.example.reactnativemultithreading;

import com.facebook.react.ReactActivity;
import com.facebook.react.config.ReactFeatureFlags;

public class MainActivity extends ReactActivity {

  static {
    ReactFeatureFlags.useTurboModules = true;
    ReactFeatureFlags.eagerInitializeFabric = true;
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MultithreadingExample";
  }
}
