#import "UltimateListInstaller.h"
#import "RNMultithreading.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <ReactCommon/RCTTurboModuleManager.h>
#import <jsi/jsi.h>
#import <React/RCTView.h>
#import <memory>

#import <RNReanimated/REAIOSScheduler.h>
#import <RNReanimated/REAIOSErrorHandler.h>

using namespace facebook;

@implementation RNMultithreading
@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  
  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
  if (!cxxBridge.runtime) {
    return;
  }
  
  auto callInvoker = bridge.jsCallInvoker;
  

  osdnk::ultimatelist::installSimple(*(jsi::Runtime *)cxxBridge.runtime);
}

@end

