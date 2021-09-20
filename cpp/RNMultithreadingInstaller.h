#include <__bit_reference>
// C mrousavy

#pragma once
#include <jsi/jsi.h>

#if __has_include(<RNReanimated/Scheduler.h>)
#include <RNReanimated/Scheduler.h>
#include <RNReanimated/ShareableValue.h>
#include <RNReanimated/ErrorHandler.h>
#else
#include "Scheduler.h"
#include "ErrorHandler.h"
#include "ShareableValue.h"

#endif

using namespace facebook;

namespace mrousavy {
namespace multithreading {

    double getValue(std::string label);
    std::string obtainStringValueAtIndexByKey(int index, std::string label);
    double setUIRuntime(jsi::Runtime& aruntime);


    void install(jsi::Runtime& cruntime,
                 const std::function<std::unique_ptr<jsi::Runtime>()>& makeRuntime,
                 const std::function<std::shared_ptr<reanimated::Scheduler>()>& makeScheduler,
                 const std::function<std::shared_ptr<reanimated::ErrorHandler>(std::shared_ptr<reanimated::Scheduler>)>& makeErrorHandler);


    void installSimple(jsi::Runtime& cruntime,
                 const std::function<std::unique_ptr<jsi::Runtime>()>& makeRuntime,
                 const std::function<std::shared_ptr<reanimated::Scheduler>()>& makeScheduler,
                 const std::function<std::shared_ptr<reanimated::ErrorHandler>(std::shared_ptr<reanimated::Scheduler>)>& makeErrorHandler);


    void install2(jsi::Runtime& cruntime,
                 const std::function<std::unique_ptr<jsi::Runtime>()>& makeRuntime,
                 const std::function<std::shared_ptr<reanimated::Scheduler>()>& makeScheduler,
                 const std::function<std::shared_ptr<reanimated::ErrorHandler>(std::shared_ptr<reanimated::Scheduler>)>& makeErrorHandler);

}
}
