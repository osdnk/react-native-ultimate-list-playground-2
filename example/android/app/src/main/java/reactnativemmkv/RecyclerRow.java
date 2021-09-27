package reactnativemmkv;

import android.util.Log;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.recyclerview.widget.RecyclerView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.UiThreadUtil;
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
    for (Integer id : ultraFastChildren) {
      UltraFastAbstractComponentWrapper component = (UltraFastAbstractComponentWrapper) findViewById(id);
      component.setValue(valueGetter.getJSValue(component.mBinding));
    }
  }

  public void setInitialPosition(int position) {
    //mPosition = position;
   //notifyUltraFastEvents(valueGetter);
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
  public void setLayoutParams(LayoutParams params) {
    super.setLayoutParams(params);
    Log.d("new sized", "SIZE " + getMeasuredHeight());
    if (getParent() instanceof FrameLayout) {
      ((FrameLayout) getParent()).setLayoutParams(params);
    }
  }

  private int setHeight = 0;
  public int mIgnoreResizing = 2;
  public void tryResizing() {
    if (getParent().getParent() instanceof RecyclerView) {
//      if (mIgnoreResizing != 0) {
//        mIgnoreResizing--;
//        return;
//      }
      if (setHeight == getBottom() - getTop()) {
      //  return;
      }
      Log.d("Setting L to parent", "GGGG " + setHeight);
      setHeight = getBottom() - getTop();
      if (((FrameLayout) getParent()).getBottom() != ((FrameLayout) getParent()).getTop() + getBottom() - getTop()) {
        ((FrameLayout) getParent()).layout(
                ((FrameLayout) getParent()).getLeft(),
                ((FrameLayout) getParent()).getTop(),
                ((FrameLayout) getParent()).getRight(),
                ((FrameLayout) getParent()).getTop() + getBottom() - getTop());
      };
//
//        UiThreadUtil.runOnUiThread(() -> {
//                 ((FrameLayout) getParent()).getLayoutParams().height = bottom - top;
//                 getParent().requestLayout();
//        });
//
        //       getParent().requestLayout();
//        getParent().getParent().requestLayout();
        //((RecyclerView) getParent().getParent()).getAdapter().notifyItemChanged();

        // ((RecyclerView) getParent().getParent()).requestLayout();

//        ((FrameLayout) getParent()).setLayoutParams(
//                new FrameLayout.LayoutParams(((FrameLayout) getParent()).getLayoutParams())
//        );
     // }

    }
  }


  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    super.onLayout(changed, left, top, right, bottom);
    ViewParent maybeStorage = getParent().getParent();
    Log.d("XXXXXXX", "New size" + (bottom - top));
    if (maybeStorage instanceof CellStorage) {
      ((CellStorage) maybeStorage).notifySomeViewIsReady();
    }
    //if (changed) {
     // tryResizing();
    if (getParent().getParent() instanceof RecyclerView) {


//      if (((FrameLayout) getParent()).getBottom() != ((FrameLayout) getParent()).getTop() + 100) {
//        ((FrameLayout) getParent()).layout(
//                ((FrameLayout) getParent()).getLeft(),
//                ((FrameLayout) getParent()).getTop(),
//                ((FrameLayout) getParent()).getRight(),
//                ((FrameLayout) getParent()).getTop() + 100);
//      }
     // ;
    }
    //}


//      getParent().requestLayout();

  //Log.d("XXX2", "Rendered a child od size " + (bottom - top));


  }

//  @Override
//  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
//    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
//    if (getParent().getParent() instanceof RecyclerView) {
//      ((FrameLayout)getParent()).getLayoutParams().height = heightMeasureSpec;
//      ((FrameLayout)getParent()).getLayoutParams().width = widthMeasureSpec;
//      getParent().requestLayout();
//    }
//
//    }

  public RecyclerRow(ThemedReactContext context) {
    super(context);
    this.context = context;
  }

}
