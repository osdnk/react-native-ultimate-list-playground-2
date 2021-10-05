/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include <memory>
#include <string>

#include <fbjni/fbjni.h>
#include <react/nativemodule/core/ReactCommon/TurboModule.h>
#include <react/nativemodule/core/platform/android/ReactCommon/JavaTurboModule.h>
#include <ReactCommon/TurboModuleManagerDelegate.h>


namespace facebook {
namespace react {

class RNTester2TurboModuleManagerDelegate : public jni::HybridClass<RNTester2TurboModuleManagerDelegate, TurboModuleManagerDelegate> {
public:
  static constexpr auto kJavaDescriptor =
      "Lcom/example/reactnativemultithreading/RNTesterTurboModuleManagerDelegate;";

  static jni::local_ref<jhybriddata> initHybrid(jni::alias_ref<jhybridobject>);

  static void registerNatives();

  std::shared_ptr<TurboModule> getTurboModule(const std::string name, const std::shared_ptr<CallInvoker> jsInvoker) override;
  std::shared_ptr<TurboModule> getTurboModule(const std::string name, const JavaTurboModule::InitParams &params) override;

  /**
   * Test-only method. Allows user to verify whether a TurboModule can be created
   * by instances of this class.
   */
  bool canCreateTurboModule(std::string name);

private:
  friend HybridBase;
  using HybridBase::HybridBase;

};

} // namespace react
} // namespace facebook
