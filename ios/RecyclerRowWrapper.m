//
//  RecyclerRow.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerRowWrapper.h"
#import <React/RCTView.h>

@implementation RecyclerRowWrapperManager

RCT_EXPORT_MODULE(RecyclerRowWrapper)

- (RCTView *)view
{
  return [[RCTView alloc] init];
}

@end
