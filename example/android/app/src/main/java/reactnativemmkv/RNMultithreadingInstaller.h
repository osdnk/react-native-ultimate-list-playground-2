#include <__bit_reference>
// C osdnk

#pragma once
#include <jsi/jsi.h>

#include "Scheduler.h"
#include "ShareableValue.h"


using namespace facebook;

namespace osdnk {
namespace ultimatelist {

    std::string obtainStringValueAtIndexByKey(int index, std::string label, int id);

    std::string obtainTypeAtIndexBy(int index, int id);
    void installSimple(jsi::Runtime& cruntime);
    void setNotifyNewData(std::function<void (int)> notifier);


}
}
