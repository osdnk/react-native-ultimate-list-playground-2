#include "RNMultithreadingInstaller.h"
#include <memory>
#include "ThreadPool.h"
#include <exception>

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

#ifdef ON_ANDROID
#include <fbjni/fbjni.h>
#endif

namespace mrousavy {
namespace multithreading {


    std::shared_ptr<reanimated::RuntimeManager> manager;
    std::shared_ptr<reanimated::RuntimeManager> manager2 = nullptr;
    std::shared_ptr<reanimated::ShareableValue> dataValue = nullptr;

    double getValue(std::string label) {
        auto runt = manager.get()->runtime.get();
        return dataValue.get()->getValue(*runt).asObject(*runt).getProperty(*runt, label.c_str()).asNumber();
    }

    double setUIRuntime(jsi::Runtime& runtime) {

        return dataValue.get()->getValue(runtime).asNumber();
    }

    std::string obtainStringValueAtIndexByKey(int index, std::string label) {
//        auto runt = manager.get()->runtime.get();
//

//        if (dataValue == nullptr) {
//            return "****";
//        }
//
//        auto val = dataValue.get();
//
//        manager->scheduler->scheduleOnJS([runt, val] () {
//            //val->getValue(*runt);
//            //val->asObject(runt).asFunction(runtime).call(runtime, ));
//        });
//

//        auto resolver = [runt, resolverValue](const std::shared_ptr<reanimated::ShareableValue>& shareableValue) {
//            manager->scheduler->scheduleOnJS([&runtime, resolverValue, shareableValue] () {
//                resolverValue->asObject(runtime).asFunction(runtime).call(runtime, shareableValue->getValue(runtime));
//            });
//        };
//        if (val.isString()) {
//            return val.asString(*runt).utf8(*runt);
//        }
//        if (val.isNumber()) {
//            return "XXXXX";
//            //return val.asNumber(*runt).utf8(*runt);
//        }

        if (dataValue == nullptr) {
            return "TTTT";
        }

        auto dv = dataValue.get();
        auto& rt = manager.get()->runtime;
        auto givenData = dataValue.get()->getValue(*rt).asObject(*rt).asArray(*rt).getValueAtIndex(*rt, index);
//            double g = animatedArray.length(*runt);
//            if (index < g) {
//                auto b = animatedArray.getValueAtIndex(*runt, index);
//        manager->scheduler->scheduleOnUI([&rt, &dv] () {
        //return dv->getValue(*rt).asString(*rt).utf8(*rt);
//        });
       // return "NO CRASH";

       // auto animatedObject = dataValue.get()->getValue(*rt);



        size_t pos;
        std::string token;
        while ((pos = label.find(".")) != std::string::npos) {
            token = label.substr(0, pos);
            givenData = givenData
                    .asObject(*rt)
                    .getProperty(*rt, token.c_str());
            label.erase(0, pos + 1);
        }

        givenData = givenData
                .asObject(*rt)
                .getProperty(*rt, label.c_str());


        //if (animatedObject.isArray(*rt)) {
//        auto animatedArray = animatedObject.asObject(*rt).asArray(*rt);
//            double g = animatedArray.length(*rt);
//           // if (index < g) {
//        auto b = animatedArray.getValueAtIndex(*rt, index);
//             //   if (b.isObject()) {
//        auto givenObj = b.asObject(*rt);
//                //    if (givenObj.hasProperty(*rt, label.c_str())) {
//        auto prop = givenObj.getProperty(*rt, label.c_str());
//                 //       if (prop.isString()) {
        return givenData.asString(*rt).utf8(*rt);



                   //     }
                   // }
               // }
           // }
       // }

        return "BB";
//
//
//        auto animatedObject = dataValue.get()->getValue(*runt).asObject(*runt);
//        if (animatedObject.isArray(*runt)) {
//            auto animatedArray = animatedObject.asArray(*runt);
//            double g = animatedArray.length(*runt);
//            if (index < g) {
//                auto b = animatedArray.getValueAtIndex(*runt, index);
//                if (b.isObject()) {
//                    auto givenObj = b.asObject(*runt);
//                    if (givenObj.hasProperty(*runt, label.c_str())) {
//                        auto prop = givenObj.getProperty(*runt, label.c_str());
//                        if (prop.isString()) {
//                            return prop.asString(*runt).utf8(*runt);
//                        }
//                    }
//                }
//            }
//        }
//
//        return "FF";

    }


    void install(jsi::Runtime& runtime,
                 const std::function<std::unique_ptr<jsi::Runtime>()>& makeRuntime,
                 const std::function<std::shared_ptr<reanimated::Scheduler>()>& makeScheduler,
                 const std::function<std::shared_ptr<reanimated::ErrorHandler>(std::shared_ptr<reanimated::Scheduler>)>& makeErrorHandler) {
        auto pool = std::make_shared<ThreadPool>(1);

        // Quickly setup the runtime - this is executed in parallel so we have to join this on the JS thread if spawnThread is called before this finishes.
        auto setupFutureSingle = pool->enqueue([makeScheduler, makeRuntime, makeErrorHandler]() {
#ifdef ON_ANDROID
            // We need to attach this Thread to JNI because the Runtime is a HybridClass.
            jni::ThreadScope::WithClassLoader([makeRuntime, makeScheduler, makeErrorHandler]() {
                __unused jni::ThreadScope scope;
#endif
                auto runtime = makeRuntime();
                reanimated::RuntimeDecorator::decorateRuntime(*runtime, "CUSTOM_THREAD_1");
                auto scheduler = makeScheduler();
                auto errorHandler = makeErrorHandler(scheduler);
                manager = std::make_unique<reanimated::RuntimeManager>(std::move(runtime),
                                                                       errorHandler,
                                                                       scheduler);

#ifdef ON_ANDROID
            });
#endif
        });
        auto setupFuture = std::make_shared<std::future<void>>(std::move(setupFutureSingle));

        // spawnThread(run: () => T): Promise<T>
        auto spawnThread = jsi::Function::createFromHostFunction(runtime,
                                                                 jsi::PropNameID::forAscii(runtime, "spawnThread"),
                                                                 1,  // run
                                                                 [setupFuture, pool](jsi::Runtime& cruntime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
                                                                     if (!arguments[0].isObject())
                                                                         throw jsi::JSError(cruntime, "spawnThread: First argument has to be a function!");

                                                                     if (count == 2) {
                                                                         dataValue = reanimated::ShareableValue::adapt(cruntime, arguments[1], manager.get());
                                                                     }


                                                                     if (setupFuture->valid())
                                                                         setupFuture->get(); // clears future, makes invalid

                                                                     auto worklet = reanimated::ShareableValue::adapt(cruntime, arguments[0], manager.get());

                                                                     auto spawnThreadCallback = jsi::Function::createFromHostFunction(cruntime,
                                                                                                                                      jsi::PropNameID::forAscii(cruntime, "spawnThreadCallback"),
                                                                                                                                      2,
                                                                                                                                      [worklet, pool](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
                                                                                                                                          auto resolverValue = std::make_shared<jsi::Value>((arguments[0].asObject(runtime)));
                                                                                                                                          auto rejecterValue = std::make_shared<jsi::Value>((arguments[1].asObject(runtime)));

                                                                                                                                          auto resolver = [&runtime, resolverValue](const std::shared_ptr<reanimated::ShareableValue>& shareableValue) {
                                                                                                                                              manager->scheduler->scheduleOnJS([&runtime, resolverValue, shareableValue] () {
                                                                                                                                                  resolverValue->asObject(runtime).asFunction(runtime).call(runtime, shareableValue->getValue(runtime));
                                                                                                                                              });
                                                                                                                                          };
                                                                                                                                          auto rejecter = [&runtime, rejecterValue](const std::string& message) {
                                                                                                                                              manager->scheduler->scheduleOnJS([&runtime, rejecterValue, message] () {
                                                                                                                                                  rejecterValue->asObject(runtime).asFunction(runtime).call(runtime, jsi::JSError(runtime, message).value());
                                                                                                                                              });
                                                                                                                                          };

                                                                                                                                          pool->enqueue([resolver, rejecter, worklet]() {
                                                                                                                                              try {
                                                                                                                                                  auto& runtime = *manager->runtime;

                                                                                                                                                  auto function = worklet->getValue(runtime).asObject(runtime).asFunction(runtime);
                                                                                                                                                  auto result = function.getFunction(runtime).callWithThis(runtime, function);

                                                                                                                                                  auto shareableResult = reanimated::ShareableValue::adapt(runtime, result, manager.get());
                                                                                                                                                  resolver(shareableResult);
                                                                                                                                              } catch (std::exception& exc) {
                                                                                                                                                  rejecter(exc.what());
                                                                                                                                              }
                                                                                                                                          });
                                                                                                                                          return jsi::Value::undefined();
                                                                                                                                      });

                                                                     auto newPromise = cruntime.global().getProperty(cruntime, "Promise");
                                                                     auto promise = newPromise
                                                                             .asObject(cruntime)
                                                                             .asFunction(cruntime)
                                                                             .callAsConstructor(cruntime, spawnThreadCallback);

                                                                     return promise;
                                                                 });


        auto setData = jsi::Function::createFromHostFunction(runtime,
                                                             jsi::PropNameID::forAscii(runtime, "setData"),
                                                             1,  // run
                                                             [setupFuture, pool](jsi::Runtime& cruntime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
                                                                 //dataValue = reanimated::ShareableValue::adapt(cruntime, arguments[0], manager.get());
                                                                 return jsi::Value();
                                                             });
       // runtime.global().setProperty(runtime, "setData", std::move(setData));
        runtime.global().setProperty(runtime, "spawnThread", std::move(spawnThread));

    }


    void installSimple(jsi::Runtime& runtime,
                 const std::function<std::unique_ptr<jsi::Runtime>()>& makeRuntime,
                 const std::function<std::shared_ptr<reanimated::Scheduler>()>& makeScheduler,
                 const std::function<std::shared_ptr<reanimated::ErrorHandler>(std::shared_ptr<reanimated::Scheduler>)>& makeErrorHandler) {
        auto pool = std::make_shared<ThreadPool>(1);
//dddd
        // Quickly setup the runtime - this is executed in parallel so we have to join this on the JS thread if spawnThread is called before this finishes.
        auto setupFutureSingle = pool->enqueue([makeScheduler, makeRuntime, makeErrorHandler]() {
#ifdef ON_ANDROID
            // We need to attach this Thread to JNI because the Runtime is a HybridClass.
            jni::ThreadScope::WithClassLoader([makeRuntime, makeScheduler, makeErrorHandler]() {
                __unused jni::ThreadScope scope;
#endif
                auto runtime = makeRuntime();
                reanimated::RuntimeDecorator::decorateRuntime(*runtime, "CUSTOM_THREAD_1");
                auto scheduler = makeScheduler();
                auto errorHandler = makeErrorHandler(scheduler);
                manager = std::make_shared<reanimated::RuntimeManager>(std::move(runtime),
                                                                       errorHandler,
                                                                       scheduler);
                scheduler->setRuntimeManager(manager);


#ifdef ON_ANDROID
            });
#endif
        });
        auto setupFuture = std::make_shared<std::future<void>>(std::move(setupFutureSingle));

//
        auto setData = jsi::Function::createFromHostFunction(runtime,
                                                             jsi::PropNameID::forAscii(runtime, "setData"),
                                                             1,  // run
                                                             [setupFuture, pool](jsi::Runtime& cruntime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {

                                                              //  manager->scheduler->scheduleOnUI([&cruntime, arguments]() {
                                                                     dataValue = reanimated::ShareableValue::adapt(cruntime, arguments[0], manager.get());
                                                               //  });
                                                                 return jsi::Value();
                                                             });
        runtime.global().setProperty(runtime, "setData", std::move(setData));

    }

} // namespace multithreading
} // namespace mrousavy
