package reactnativemmkv;

import android.util.Log;
import android.view.ViewGroup;
import android.view.ViewParent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashSet;
import java.util.Set;

class RecyclerRow extends ReactViewGroup {
  private ThemedReactContext context;
  private int mPosition = -1;
  private Set<Integer> ultraFastChildren = new HashSet<>();

  public void addUltraFastChildren(int id) {
    ultraFastChildren.add(id);
  }

  private void notifyUltraFastEvents(JSValueGetter valueGetter) {
    for (Integer id: ultraFastChildren ) {
      UltraFastAbstractComponentWrapper component = (UltraFastAbstractComponentWrapper) findViewById(id);
      component.setValue(valueGetter.getJSValue(component.mBinding));
    }
  }

  public void setInitialPosition(int position) {
    //mPosition = position;
   // notifyUltraFastEvents(valueGetter);
  }

  private void notifyReanimatedComponents(int position) {
    WritableMap mExtraData = Arguments.createMap();
    mExtraData.putInt("position", position);
    mExtraData.putInt("previousPosition", mPosition);
    mPosition = position;
    context.getNativeModule(UIManagerModule.class).getEventDispatcher().dispatchEvent(new Event(context.getSurfaceId(), getId()) {
      @Override
      public String getEventName() {
        return "onRecycle";
      }

      @Override
      protected WritableMap getEventData() {
        return mExtraData;
      }
    });
  }

  public void recycle(int position, JSValueGetter valueGetter) {
    notifyUltraFastEvents(valueGetter);
    notifyReanimatedComponents(position);
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    super.onLayout(changed, left, top, right, bottom);
    ViewParent maybeStorage = getParent().getParent();
    Log.d("XXX2", "Rendered a child od size " + (bottom - top));

    if (maybeStorage instanceof CellStorage) {
      ((CellStorage) maybeStorage).notifySomeViewIsReady();
    }
  }

  public RecyclerRow(ThemedReactContext context) {
    super(context);
    this.context = context;
  }

}
