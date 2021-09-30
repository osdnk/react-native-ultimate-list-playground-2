package ultimatelist;

import android.view.View;
import android.view.ViewParent;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.security.cert.CertStoreSpi;
import java.util.Map;

class RecyclerRowManager extends ViewGroupManager<RecyclerRow> {
  public static final String REACT_CLASS = "RecyclerRow";
  ReactApplicationContext mCallerContext;

  public RecyclerRowManager(ReactApplicationContext reactContext) {
    mCallerContext = reactContext;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public RecyclerRow createViewInstance(ThemedReactContext context) {
    return new RecyclerRow(context);
  }

  @ReactProp(name = "initialPosition")
  public void setInitialPosition(RecyclerRow view, int initialPosition) {
    view.setInitialPosition(initialPosition);
  }

  @ReactProp(name = "type")
  public void setType(RecyclerRow view, String type) {
    view.mType = type;
  }

  @Override
  public @Nullable
  Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return createExportedCustomDirectEventTypeConstants();
  }

  public static Map<String, Object> createExportedCustomDirectEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
      .put(
        "onRecycle",
        MapBuilder.of("registrationName", "onRecycle"))
      .build();
  }
}
