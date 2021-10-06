//
//  RecyclerList.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerList.h"
#import <React/RCTView.h>

@implementation RecyclerListManager

RCT_EXPORT_MODULE(RecyclerRow)

- (RCTView *)view
{
  return [[RCTView alloc] init];
}

@end
