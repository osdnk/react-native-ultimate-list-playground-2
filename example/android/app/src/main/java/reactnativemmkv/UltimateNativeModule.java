package reactnativemmkv;

import static com.reactnativemultithreading.MultithreadingModule.sScheduler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.fbreact.specs.NativeFileReaderModuleSpec;
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
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;
//import com.reactnativemmkv.MmkvModule;

@ReactModule(name = "UltimateNative")
class UltimateNativeModule extends ReactContextBaseJavaModule {
  static {
    System.loadLibrary("reanimated");
  }

  private static native long getValue(String label);
  private static native void setUIPointerThread(long jsiPtr);
//  private static native void installPointerGetter(long animatedRuntimeAddress);

  public long sAnimatedRuntimeAddress = -1;

  private ReactContext context;

  public UltimateNativeModule(ReactContext reactContext) {
    super();
    this.context = reactContext;
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

  public static native byte[] getStringValueAtIndexByKey(int index, String key, int id);

  public String stringValueAtIndexByKey(int index, String key, int id) {
   // return "XXXXXXXX";
//    NativeProxy x = context.getNativeModule(ReanimatedModule.class).getNodesManager().getNativeProxy();
//    Class c = NativeProxy.class;
//    Field m[] = c.getFields();
//    for (int i = 0; i < m.length; i++)
//      System.out.println(m[i].toString());
    byte[] bytes = getStringValueAtIndexByKey(index, key, id);
    return new String(bytes, StandardCharsets.UTF_8);
  }

  @NonNull
  @Override
  public String getName() {
    return "UltimateNative";
  }
}
