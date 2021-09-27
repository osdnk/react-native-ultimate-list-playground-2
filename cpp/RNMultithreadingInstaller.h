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

    std::string obtainStringValueAtIndexByKey(int index, std::string label, int id);

    void installSimple(jsi::Runtime& cruntime);


}
}
