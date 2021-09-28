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

JavaVM* g_jvm = 0;



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
    std::string value = mrousavy::multithreading::obtainStringValueAtIndexByKey(index, jstring2string(env, key), id);
    int byteCount = value.length();
    jbyte* pNativeMessage = const_cast<jbyte *>(reinterpret_cast<const jbyte *>(value.c_str()));
    jbyteArray bytes = env->NewByteArray(byteCount);
    env->SetByteArrayRegion(bytes, 0, byteCount, pNativeMessage);
    return  bytes;
}

extern "C"
JNIEXPORT jbyteArray JNICALL
Java_reactnativemmkv_UltimateNativeModule_getTypeAtIndex(JNIEnv *env, jclass clazz,
                                                                     jint index, jint id) {
    std::string value = mrousavy::multithreading::obtainTypeAtIndexBy(index, id);
    int byteCount = value.length();
    jbyte* pNativeMessage = const_cast<jbyte *>(reinterpret_cast<const jbyte *>(value.c_str()));
    jbyteArray bytes = env->NewByteArray(byteCount);
    env->SetByteArrayRegion(bytes, 0, byteCount, pNativeMessage);
    return  bytes;
}

bool GetJniEnv(JavaVM *vm, JNIEnv **env) {
    bool did_attach_thread = false;
    *env = nullptr;
    // Check if the current thread is attached to the VM
    auto get_env_result = vm->GetEnv((void**)env, JNI_VERSION_1_6);
    if (get_env_result == JNI_EDETACHED) {
        if (vm->AttachCurrentThread(env, NULL) == JNI_OK) {
            did_attach_thread = true;
        } else {
            // Failed to attach thread. Throw an exception if you want to.
        }
    } else if (get_env_result == JNI_EVERSION) {
        // Unsupported JNI version. Throw an exception if you want to.
    }
    return did_attach_thread;
}




extern "C"
JNIEXPORT void JNICALL
Java_reactnativemmkv_UltimateNativeModule_setNotifier(JNIEnv *env, jclass clazz) {
    //jclass thisClass = env->GetObjectClass(clazz);


    env->GetJavaVM(&g_jvm);

    auto notifyNewDataCallback = [](int id) {
        JNIEnv* env2;
        g_jvm->AttachCurrentThread(&env2, NULL);
        jclass cls2 = env2->FindClass("reactnativemmkv/UltimateNativeModule");
        jmethodID notifyNewData = env2->GetStaticMethodID(cls2, "notifyNewData", "(I)V");
        env2->CallStaticVoidMethod(cls2, notifyNewData, id);

    };
   // notifyNewDataCallback(1);
    mrousavy::multithreading::setNotifyNewData(notifyNewDataCallback);
    //std::function<void (int)> c = notifyNewDataCallback;

}