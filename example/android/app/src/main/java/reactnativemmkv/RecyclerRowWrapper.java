package reactnativemmkv;

import android.view.View;
import android.view.ViewParent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashSet;
import java.util.Set;

class RecyclerRowWrapper extends ReactViewGroup {
//  @Override
//  public void addView(View child, int index, LayoutParams params) {
//    super.addView(child, index, params);
//    ViewParent maybeStorage = getParent();
//    if (maybeStorage instanceof CellStorage) {
//      ((CellStorage) maybeStorage).notifySomeViewIsReady();
//    }
//  }
//
//  @Override
//  protected void onAttachedToWindow() {

//  }


  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    super.onLayout(changed, left, top, right, bottom);
    ViewParent maybeStorage = getParent();
    if (maybeStorage instanceof CellStorage) {
      ((CellStorage) maybeStorage).setLayout(right - left, bottom - top);
    }
  }

  public RecyclerRowWrapper(ThemedReactContext context) {
    super(context);
  }

}
