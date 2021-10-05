package com.example.reactnativemultithreading;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.config.ReactFeatureFlags;

public class MainActivity extends ReactActivity {

  static {
    ReactFeatureFlags.useTurboModules = true;
    ReactFeatureFlags.eagerInitializeFabric = true;
    // ReactFeatureFlags.enableFabricRenderer = true;
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MultithreadingExample";
  }


  // copied
  public static class RNTesterActivityDelegate extends ReactActivityDelegate {
    public RNTesterActivityDelegate(ReactActivity activity, @Nullable String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      reactRootView.setIsFabric(true);
      return reactRootView;
    }
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new RNTesterActivityDelegate(this, getMainComponentName());
  }

}
