/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "RNTester2TurboModuleManagerDelegate.h"

#include "RNTesterAppModuleProvider.h"

namespace facebook {
namespace react {

jni::local_ref<RNTester2TurboModuleManagerDelegate::jhybriddata> RNTester2TurboModuleManagerDelegate::initHybrid(jni::alias_ref<jhybridobject>) {
  return makeCxxInstance();
}

void RNTester2TurboModuleManagerDelegate::registerNatives() {
  registerHybrid({
    makeNativeMethod("initHybrid", RNTester2TurboModuleManagerDelegate::initHybrid),
    //makeNativeMethod("canCreateTurboModule", RNTester2TurboModuleManagerDelegate::canCreateTurboModule),
  });
}

std::shared_ptr<TurboModule> RNTester2TurboModuleManagerDelegate::getTurboModule(const std::string name, const std::shared_ptr<CallInvoker> jsInvoker) {
  // Not implemented yet: provide pure-C++ NativeModules here.
  return nullptr;
}

std::shared_ptr<TurboModule> RNTester2TurboModuleManagerDelegate::getTurboModule(const std::string name, const JavaTurboModule::InitParams &params) {
  return RNTesterAppModuleProvider(name, params);
}

bool RNTester2TurboModuleManagerDelegate::canCreateTurboModule(std::string name) {
  return getTurboModule(name, nullptr) != nullptr || getTurboModule(name, {.moduleName = name}) != nullptr;
}

} // namespace react
} // namespace facebook
