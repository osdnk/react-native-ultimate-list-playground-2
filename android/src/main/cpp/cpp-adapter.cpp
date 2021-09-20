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

#if __has_include(<RNReanimated/Scheduler.h>)
#include <RNReanimated/Scheduler.h>
#include <RNReanimated/ShareableValue.h>
#include <RNReanimated/RuntimeManager.h>
#include <RNReanimated/RuntimeDecorator.h>
#include <RNReanimated/ErrorHandler.h>
#else
#include "Scheduler.h"
#include "ShareableValue.h"
#include "RuntimeManager.h"
#include "RuntimeDecorator.h"
#include "ErrorHandler.h"
#endif


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

        auto jsCallInvoker = jsCallInvokerHolder->cthis()->getCallInvoker();
        auto scheduler = androidScheduler->cthis()->getScheduler();
        scheduler->setJSCallInvoker(jsCallInvoker);

        auto makeScheduler = [scheduler]() -> std::shared_ptr<reanimated::Scheduler> {
            return scheduler;
        };
        auto makeErrorHandler = [](const std::shared_ptr<reanimated::Scheduler>& scheduler_) -> std::shared_ptr<reanimated::ErrorHandler> {
            return std::make_shared<reanimated::AndroidErrorHandler>(scheduler_);
        };
        auto makeJsExecutor = []() -> std::unique_ptr<jsi::Runtime> {
            __android_log_write(ANDROID_LOG_INFO, TAG, "Creating JSExecutorFactory..");
            try {
                std::shared_ptr<react::ExecutorDelegate> delegate = std::shared_ptr<react::ExecutorDelegate>();
                std::shared_ptr<react::MessageQueueThread> jsQueue = std::shared_ptr<react::MessageQueueThread>();

                auto jsExecutorFactory = makeJSExecutorFactory();
                __android_log_write(ANDROID_LOG_INFO, TAG, "Creating JSExecutor..");
                auto executor = jsExecutorFactory->createJSExecutor(delegate,
                                                                    jsQueue);
                auto runtimePointer = static_cast<jsi::Runtime*>(executor->getJavaScriptContext());
                __android_log_write(ANDROID_LOG_INFO, TAG, "JSExecutor created!");

                // I need to release the local shared_ptr because otherwise the returned jsi::Runtime will be destroyed immediately.
                auto _ = executor.release();

                return std::unique_ptr<jsi::Runtime>(runtimePointer);
            } catch (std::exception& exc) {
                // Fatal error - the runtime can't be created at all.
                __android_log_write(ANDROID_LOG_ERROR, TAG, "Failed to create JSExecutor!");
                __android_log_write(ANDROID_LOG_ERROR, TAG, exc.what());
                abort();
            }
        };
        mrousavy::multithreading::installSimple(*runtime, makeJsExecutor, makeScheduler, makeErrorHandler);
     //   mrousavy::multithreading::install(*runtime, makeJsExecutor, makeScheduler, makeErrorHandler);

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
    double x = mrousavy::multithreading::getValue(slabel);
    return x;
}
extern "C"
JNIEXPORT void JNICALL
Java_reactnativemmkv_UltimateNativeModule_setUIPointerThread(JNIEnv *env, jclass clazz,
                                                             jlong jsi_ptr) {
    // TODO: implement setUIPointerThread()
}
extern "C"
JNIEXPORT jbyteArray JNICALL
Java_reactnativemmkv_MmkvModule_getStringValueAtIndexByKey(JNIEnv *env, jclass clazz, jint index,
                                                           jstring key) {
//    auto runtime = reinterpret_cast<jsi::Runtime*>(jsiPtr);
    std::string value = mrousavy::multithreading::obtainStringValueAtIndexByKey(index, jstring2string(env, key));
    int byteCount = value.length();
    jbyte* pNativeMessage = const_cast<jbyte *>(reinterpret_cast<const jbyte *>(value.c_str()));
    jbyteArray bytes = env->NewByteArray(byteCount);
    env->SetByteArrayRegion(bytes, 0, byteCount, pNativeMessage);
    return  bytes;
}
extern "C"
JNIEXPORT jbyteArray JNICALL
Java_reactnativemmkv_UltimateNativeModule_getStringValueAtIndexByKey(JNIEnv *env, jclass clazz,
                                                                     jint index, jstring key) {
    // TODO: implement getStringValueAtIndexByKey()
    std::string value = mrousavy::multithreading::obtainStringValueAtIndexByKey(index, jstring2string(env, key));
    int byteCount = value.length();
    jbyte* pNativeMessage = const_cast<jbyte *>(reinterpret_cast<const jbyte *>(value.c_str()));
    jbyteArray bytes = env->NewByteArray(byteCount);
    env->SetByteArrayRegion(bytes, 0, byteCount, pNativeMessage);
    return  bytes;
}