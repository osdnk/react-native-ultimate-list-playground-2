//
//  RecyclerRow.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "UltraFastTextWrapper.h"
#import <React/RCTView.h>

@implementation UltraFastTextWrapperManager

RCT_EXPORT_MODULE(UltraFastTextWrapper)

- (RCTView *)view
{
  return [[RCTView alloc] init];
}

@end
