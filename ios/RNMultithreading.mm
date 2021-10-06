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
#import "MakeJSIRuntime.h"

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


//

#import <React/RCTViewManager.h>



// RecyclerListView

@interface RecyclerListViewManager : RCTViewManager
@end

@implementation RecyclerListViewManager

RCT_EXPORT_MODULE(RecyclerListView)

- (UIView *)view
{
  return [[RCTView alloc] init];
}

@end


// RecyclerRowWrapper
@interface RecyclerRowWrapperViewManager : RCTViewManager
@end

@implementation RecyclerRowWrapperViewManager

RCT_EXPORT_MODULE(RecyclerRowWrapper)

- (UIView *)view
{
  return [[RCTView alloc] init];
}

@end

// CellStorage
@interface CellStorageViewManager : RCTViewManager
@end

@implementation CellStorageViewManager

RCT_EXPORT_MODULE(CellStorage)

- (UIView *)view
{
  return [[RCTView alloc] init];
}

@end

// UltraFastTextWrapper
@interface UltraFastTextWrapperViewManager : RCTViewManager
@end

@implementation UltraFastTextWrapperViewManager

RCT_EXPORT_MODULE(UltraFastTextWrapper)

- (UIView *)view
{
  return [[RCTView alloc] init];
}

@end

