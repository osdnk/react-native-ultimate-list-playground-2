package ultimatelist;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

class RecyclerRowWrapperManager extends ViewGroupManager<RecyclerRowWrapper> {
  public static final String REACT_CLASS = "RecyclerRowWrapper";
  ReactApplicationContext mCallerContext;

  public RecyclerRowWrapperManager(ReactApplicationContext reactContext) {
    mCallerContext = reactContext;
  }

//  @ReactProp(name = "initialPosition")
//  public void setInitialPosition(RecyclerRowWrapper view, int initialPosition) {
//    view.mPosition = initialPosition;
//  }



  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public RecyclerRowWrapper createViewInstance(ThemedReactContext context) {
    return new RecyclerRowWrapper(context);
  }
}
