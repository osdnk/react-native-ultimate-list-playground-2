#include "RNMultithreadingInstaller.h"
#include <memory>
#include "ThreadPool.h"
#include "ShareableNativeValue.h"
#include <exception>



#ifdef ON_ANDROID
#include <fbjni/fbjni.h>
#endif

using namespace facebook;


namespace mrousavy {
namespace multithreading {


    std::shared_ptr<ShareableNativeValue> dataValue2 = nullptr;
    std::string obtainStringValueAtIndexByKey(int index, std::string label) {
        if (dataValue2 == nullptr) {
            return "XXXX";
        }

        if (dataValue2->isArray()) {
            auto valueAtIndex = ((ArrayNativeWrapper*) dataValue2->valueContainer.get())->getValueAtIndex(index);
            if (valueAtIndex->isObject()) {
                auto givenData = valueAtIndex;
                size_t pos;
                std::string token;
                while ((pos = label.find('.')) != std::string::npos) {
                    token = label.substr(0, pos);
                    givenData = ((ObjectNativeWrapper *)(givenData->valueContainer.get()))->getProperty(token);
                    label.erase(0, pos + 1);
                }
                auto property = ((ObjectNativeWrapper*) givenData->valueContainer.get())->getProperty(label);
                if (property->isString()) {
                    return ((StringNativeWrapper*) property->valueContainer.get())->getValue();
                }
            }
        }
        return "VVV";

    }



    void installSimple(jsi::Runtime& runtime) {



        auto setDataS = jsi::Function::createFromHostFunction(runtime,
                                                             jsi::PropNameID::forAscii(runtime, "setDataS"),
                                                             1,  // run
                                                             [](jsi::Runtime& cruntime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
                                                                 dataValue2 = ShareableNativeValue::adapt(cruntime, arguments[0]);
                                                                 return jsi::Value();
                                                             });
        runtime.global().setProperty(runtime, "setDataS", std::move(setDataS));

    }

} // namespace multithreading
} // namespace mrousavy
