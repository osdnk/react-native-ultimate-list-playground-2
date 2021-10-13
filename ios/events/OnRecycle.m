//
//  OnRecycle.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 10/10/2021.
//

#import "OnRecycle.h"


@implementation RCTOnRecycleEvent {
  NSDictionary* _body;
  NSString *_eventName;
}



@synthesize viewTag = _viewTag;

- (NSString *)eventName
{
    return @"onRecycle";
}

- (instancetype)initWithReactTag:(NSNumber *)reactTag
                        position:(NSInteger)position
                    prevPosition:(NSInteger)prevPosition
{
  if ((self = [super init])) {
    _viewTag = reactTag;
    _body = @{
      @"position": [NSNumber numberWithLong:position],
      @"prevPosition": [NSNumber numberWithLong:prevPosition]
    };
  }
  return self;
}

+ (NSString *)moduleDotMethod
{
  return @"RCTEventEmitter.receiveEvent";
}

- (NSArray *)arguments {
  return @[self.viewTag, RCTNormalizeInputEventName(@"onRecycle"), _body];;
}


- (BOOL)canCoalesce {
  return NO;
}


- (NSDictionary *)body {
  return _body;
}

@end
