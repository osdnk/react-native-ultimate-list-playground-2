package reactnativemmkv;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

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
