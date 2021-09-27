package reactnativemmkv;

import static reactnativemmkv.UltimateNativeModule.sLists;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
// import com.reactnativemmkv.MmkvModule;

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
    sLists.put(id, view);
  }

//  @ReactProp(name = "animatedRuntimeAddress")
//  public void setAnimatedRuntimeAddress(RecyclerListView view, String animatedRuntimeAddress) {
//    Log.d("XXX", animatedRuntimeAddress);
//    //MmkvModule.sAnimatedRuntimeAddress = Long.parseLong(animatedRuntimeAddress);;
//  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public RecyclerListView createViewInstance(ThemedReactContext context) {
    return new RecyclerListView(context);
  }
}
