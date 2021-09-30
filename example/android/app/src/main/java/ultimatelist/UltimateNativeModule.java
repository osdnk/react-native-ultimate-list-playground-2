package ultimatelist;

import static com.reactnativemultithreading.MultithreadingModule.sScheduler;

import android.util.Log;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.facebook.fbreact.specs.NativeFileReaderModuleSpec;
import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationCausedNativeException;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;
import com.swmansion.reanimated.NativeProxy;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;
import com.swmansion.reanimated.ReanimatedModule;

import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;
import java.util.WeakHashMap;
//import com.reactnativemmkv.MmkvModule;

@ReactModule(name = "UltimateNative")
@Keep
public class UltimateNativeModule extends ReactContextBaseJavaModule {
  static {
    System.loadLibrary("reanimated");
  }

  static public Map<Integer, RecyclerListView> sLists = new WeakHashMap<>();

  private static native long getValue(String label);
  private static native void setUIPointerThread(long jsiPtr);
  private static native byte[] getTypeAtIndex(int index, int id);
  private static native byte[] getHashAtIndex(int index, int id);
//  private static native void installPointerGetter(long animatedRuntimeAddress);

  public long sAnimatedRuntimeAddress = -1;

  private ReactContext context;

  public UltimateNativeModule(ReactContext reactContext) {
    super();
    this.context = reactContext;
    notifyNewData(1);
    setNotifier();
  }

  @ReactMethod
  public void setUIThreadPointer(String animatedRuntimeAddress) {
//    Log.d("[GGG]", animatedRuntimeAddress);
//    sAnimatedRuntimeAddress = Long.parseLong(animatedRuntimeAddress);
//    setUIPointerThread(sAnimatedRuntimeAddress);
//    long x = getValue("0");
//    Log.d("[MAGIC]", String.valueOf(x));
//    new Timer().scheduleAtFixedRate(new TimerTask(){
//      @Override
//      public void run(){
//        Random rand = new Random();
//        String val = String.valueOf(rand.nextInt(10));
//        long x = getValue(val);
//        Log.d("[MAGIC]", String.valueOf(x) + "----" + val);
//      }
//    },0,10);
   // installPointerGetter(sAnimatedRuntimeAddress);
  }

  @Keep
  @DoNotStrip
  public static void notifyNewData(int id) {
    RecyclerListView list = sLists.get(id);
    if (list != null) {
      list.notifyNewData();
    }

    Log.d("New data", "For" + id);
  }

  public static native byte[] getStringValueAtIndexByKey(int index, String key, int id);
  public static native boolean getIsHeaderAtIndex(int index, int id);
  public static native int getLength(int id);
  public static native int[] getAdded(int id);
  public static native int[] getRemoved(int id);
  public static native void setNotifier();

  public String stringValueAtIndexByKey(int index, String key, int id) {
    byte[] bytes = getStringValueAtIndexByKey(index, key, id);
    return new String(bytes, StandardCharsets.UTF_8) + "--" + index;
  }

  public String typeAtIndex(int index, int id) {
    byte[] bytes = getTypeAtIndex(index, id);
    return new String(bytes, StandardCharsets.UTF_8);
  }

  public String hashAtIndex(int index, int id) {
    byte[] bytes = getTypeAtIndex(index, id);
    return new String(bytes, StandardCharsets.UTF_8);
  }

  public boolean isHeaderAtIndex(int index, int id) {
    return getIsHeaderAtIndex(index, id);
  }

  public int length(int id) {
    return getLength(id);
  }

  @NonNull
  @Override
  public String getName() {
    return "UltimateNative";
  }
}
