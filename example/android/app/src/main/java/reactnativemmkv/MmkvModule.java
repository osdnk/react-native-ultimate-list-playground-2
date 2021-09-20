package reactnativemmkv;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationCausedNativeException;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

@ReactModule(name = "MMKV")
public class MmkvModule extends ReactContextBaseJavaModule {
  public static long sAnimatedRuntimeAddress = -1;

  static {
    System.loadLibrary("reactnativemmkv");
  }

  private ReactContext context;
  public MmkvModule (ReactContext reactContext) {
    super();
    this.context = reactContext;
  }

  private JavaScriptContextHolder jsContext;

  public static void setTimeout(Runnable runnable, int delay){
    new Thread(() -> {
      try {
        Thread.sleep(delay);
        runnable.run();
      }
      catch (Exception e){
        System.err.println(e);
      }
    }).start();
  }

//  private static native void nativeInstall(long jsiPtr, String path);
//  private static native int getArraySize(long jsiPtr);
//  private static native void setMoreCellsNeeded(long jsiPtr);


  public void moreCellsNeeded() {
  //  setMoreCellsNeeded(this.context.getJavaScriptContextHolder().get());
  }

  public static native byte[] getStringValueAtIndexByKey(int index, String key);
//  public static native byte[] getStringValueAtIndexByKeyFromAnimatedThread(long animatedjsiPtr, long jsiptr, int index, String key);

  @ReactMethod
  public void testGettingArray(Callback callback) {
  }
//
//  public int arraySize() {
//    //return 1000;
//    return getArraySize(this.context.getJavaScriptContextHolder().get());
//  }


//  public long valueAtIndex(int index) {
//    return getValueAtIndex(this.context.getJavaScriptContextHolder().get(), index);
//  }
//  public String stringValueAtIndexByKey(int index, String key) {
//    Log.d("[A runtime]", String.valueOf(sAnimatedRuntimeAddress));
//    if (sAnimatedRuntimeAddress == -1) {
//      throw new JSApplicationCausedNativeException("sAnimatedRuntimeAddress");
//
//    }
//    byte[] bytes = getStringValueAtIndexByKey(index, key);
//    return new String(bytes, StandardCharsets.UTF_8);
//  }



//  public static void install(JavaScriptContextHolder jsContext, String storageDirectory) {
//    nativeInstall(jsContext.get(), storageDirectory);
////    setTimeout(() -> {
////      byte[] x = nativeInstall3(jsContext.get(), 0);
////      String c = new String(x, Charset.forName("UTF-8"));
////      Log.d("sss", c);
////    }, 3000);
//
//
//  }

  @NonNull
  @Override
  public String getName() {
    return "MMKV";
  }
}
