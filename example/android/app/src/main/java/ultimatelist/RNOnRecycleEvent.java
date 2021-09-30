package ultimatelist;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

class RNOnRecycleEvent extends Event<RNOnRecycleEvent> {

  private int mPosition = -1;

  public static final String EVENT_NAME = "onRecycle";

  public RNOnRecycleEvent(int position) {
    mPosition = position;
  }


  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public boolean canCoalesce() {
    return false;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    WritableMap mExtraData = Arguments.createMap();
    mExtraData.putInt("position", mPosition);
    rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, mExtraData);
  }
}
