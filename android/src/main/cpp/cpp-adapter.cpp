#include <jni.h>
#include <jsi/jsi.h>
#include <memory>
#include <fbjni/fbjni.h>
#include <ReactCommon/CallInvokerHolder.h>
#include <react/jni/JavaScriptExecutorHolder.h>
#include <android/log.h>

#include "RNMultithreadingInstaller.h"

#include "Scheduler.h"
#include "AndroidErrorHandler.h"
#include "AndroidScheduler.h"



using namespace facebook;
using namespace reanimated;


struct MultithreadingModule : jni::JavaClass<MultithreadingModule> {
public:
  __unused static constexpr auto kJavaDescriptor = "Lcom/reactnativemultithreading/MultithreadingModule;";

  static constexpr auto TAG = "RNMultithreading";

  static void registerNatives() {
    javaClassStatic()->registerNatives({
                                           makeNativeMethod("installNative",
                                                            MultithreadingModule::installNative)
                                       });
  }

private:
  static std::shared_ptr<react::JSExecutorFactory> makeJSExecutorFactory() {
    __android_log_write(ANDROID_LOG_INFO, TAG, "Calling Java method MultithreadingModule.makeJSExecutor()...");
    static const auto cls = javaClassStatic();
    static const auto method = cls->getStaticMethod<react::JavaScriptExecutorHolder()>("makeJSExecutor");
    auto result = method(cls);
    __android_log_write(ANDROID_LOG_INFO, TAG, "JavaScriptExecutor created! Getting factory...");
    return result->cthis()->getExecutorFactory();
  }

    static void installNative(jni::alias_ref<JClass>,
                              jlong jsiRuntimePointer,
                              jni::alias_ref<facebook::react::CallInvokerHolder::javaobject> jsCallInvokerHolder,
                              jni::alias_ref<AndroidScheduler::javaobject> androidScheduler) {

        auto runtime = reinterpret_cast<jsi::Runtime*>(jsiRuntimePointer);
        mrousavy::multithreading::installSimple(*runtime);

    }
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
  return facebook::jni::initialize(vm, [] {
    MultithreadingModule::registerNatives();
  });
}
/*
To create the Scheduler/AndroidErrorHandler:
1.:     #include <fbjni/fbjni.h>
2.:     class AndroidScheduler : public jni::HybridClass<AndroidScheduler>;
3.:     jni::alias_ref<AndroidScheduler::javaobject> androidScheduler
4.:     api project(":react-native-reanimated")
*/

std::string jstring2string(JNIEnv *env, jstring jStr) {
    if (!jStr)
        return "";

    const jclass stringClass = env->GetObjectClass(jStr);
    const jmethodID getBytes = env->GetMethodID(stringClass, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytes = (jbyteArray) env->CallObjectMethod(jStr, getBytes, env->NewStringUTF("UTF-8"));

    size_t length = (size_t) env->GetArrayLength(stringJbytes);
    jbyte* pBytes = env->GetByteArrayElements(stringJbytes, NULL);

    std::string ret = std::string((char *)pBytes, length);
    env->ReleaseByteArrayElements(stringJbytes, pBytes, JNI_ABORT);

    env->DeleteLocalRef(stringJbytes);
    env->DeleteLocalRef(stringClass);
    return ret;
}



extern "C"
JNIEXPORT jlong JNICALL
Java_reactnativemmkv_UltimateNativeModule_getValue(JNIEnv *env, jclass clazz, jstring label) {
    std::string slabel = jstring2string(env, label);
    // auto runtime = reinterpret_cast<jsi::Runtime*>(jsiRuntimePointer);

    // Generate random integers in range 0 to 999
    // int rand_int1 = rand.nextInt(1000);
 return 1;
}
extern "C"
JNIEXPORT void JNICALL
Java_reactnativemmkv_UltimateNativeModule_setUIPointerThread(JNIEnv *env, jclass clazz,
                                                             jlong jsi_ptr) {
    // TODO: implement setUIPointerThread()
}

extern "C"
JNIEXPORT jbyteArray JNICALL
Java_reactnativemmkv_UltimateNativeModule_getStringValueAtIndexByKey(JNIEnv *env, jclass clazz,
                                                                     jint index, jstring key, jint id) {
    // TODO: implement getStringValueAtIndexByKey()
    std::string value = mrousavy::multithreading::obtainStringValueAtIndexByKey(index, jstring2string(env, key), id);
    int byteCount = value.length();
    jbyte* pNativeMessage = const_cast<jbyte *>(reinterpret_cast<const jbyte *>(value.c_str()));
    jbyteArray bytes = env->NewByteArray(byteCount);
    env->SetByteArrayRegion(bytes, 0, byteCount, pNativeMessage);
    return  bytes;
}