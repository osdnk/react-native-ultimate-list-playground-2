package com.ultimatelist;

import static com.ultimatelist.UltimateNativeModule.sLists;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class RecyclerViewManager extends ViewGroupManager<RecyclerListView> {

  public static final String REACT_CLASS = "RecyclerListView";
  ReactApplicationContext mCallerContext;

  public RecyclerViewManager(ReactApplicationContext reactContext) {
    mCallerContext = reactContext;
  }

  @ReactProp(name = "count")
  public void setCount(RecyclerListView view, int count) {
    view.mCount = count;
  }


  @ReactProp(name = "id")
  public void setId(RecyclerListView view, int id) {
    view.mId = id;
    // TODO osdnk also removing
    sLists.put(id, view);
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public RecyclerListView createViewInstance(ThemedReactContext context) {
    return new RecyclerListView(context);
  }
}
