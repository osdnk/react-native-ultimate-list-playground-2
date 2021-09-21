package reactnativemmkv;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.Queue;
import java.util.Set;


class CellStorage extends ReactViewGroup {

  static class InflationRequests {
    private LinearLayout mView;
    private int mPosition;
    UltimateNativeModule mModule;
    InflationRequests(LinearLayout view, int position, UltimateNativeModule module) {
      mView = view;
      mPosition = position;
      mModule = module;
    }

    public void inflate(ViewGroup rowWrapper) {
      if (rowWrapper != null) {
        View viewToRemove = mView.getChildAt(0);
        RecyclerRow row = (RecyclerRow) rowWrapper.getChildAt(0);
        if (!(viewToRemove instanceof RecyclerRow)) {
          rowWrapper.removeView(row);
          mView.removeView(viewToRemove);
          mView.addView(row);
        }
        row.recycle(mPosition, new JSValueGetter(mPosition, mModule));
      }
    }
  }

  public int mNumberOfCells = 1;
  private ThemedReactContext mContext;
  UltimateNativeModule mModule;


  public void increaseNumberOfCells() {
    // maybe by 1 but doesn;t work
    mNumberOfCells+=2;
    WritableMap mExtraData = Arguments.createMap();
    mExtraData.putInt("cells", mNumberOfCells);
    mContext.getNativeModule(UIManagerModule.class).getEventDispatcher().dispatchEvent(new Event(mContext.getSurfaceId(), getId()) {
      @Override
      public String getEventName() {
        return "onMoreRowsNeeded";
      }

      @Override
      protected WritableMap getEventData() {
        return mExtraData;
      }
    });
  }

  int mMinWidth;
  int mMinHeight;
  boolean mLayoutSet = false;


  private Queue<InflationRequests> mViewsNeedingInflating = new ArrayDeque();

  public void registerViewNeedingInflating(LinearLayout view, int position) {
    mViewsNeedingInflating.add(new InflationRequests(view, position, mModule));
  }

//  @Override
//  public void addView(View child, int index, LayoutParams params) {
//    super.addView(child, index, params);
//    if (!mViewsNeedingInflating.isEmpty()) {
//      LinearLayout view = mViewsNeedingInflating.poll();
//    }
//  }

  public ViewGroup getFirstNonEmptyChild() {
    int count = getChildCount();
    for (int i = 0; i < count; i++) {
      View child = getChildAt(i);
      if (child instanceof ViewGroup && ((ViewGroup) child).getChildCount() > 0) {
        return (ViewGroup) child;
      }
    }
    return null;
  }

  public void notifySomeViewIsReady() {
    if (mViewsNeedingInflating.isEmpty()) {
      return;
    }
    InflationRequests inflationRequests = mViewsNeedingInflating.poll();
    ViewGroup row = getFirstNonEmptyChild();
    inflationRequests.inflate(row);
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    if (!mLayoutSet) {
      // TODO osdnk make it reactive
      mLayoutSet = true;
      mMinWidth = right - left;
      mMinHeight = bottom - top;
    }
    super.onLayout(changed, left, top, right, bottom);
  }

  //  @Override
//  public void addView(View child) {
//    super.addView(child);
//
//    Log.d("[measured]", ":" + mMinWidth + "." + mMinHeight);
//  }

  public CellStorage(ThemedReactContext context) {
    super(context);
    mModule = context.getNativeModule(UltimateNativeModule.class);
    mContext = context;
  }
}
