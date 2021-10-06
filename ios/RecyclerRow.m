//
//  RecyclerRow.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerRow.h"
#import <React/RCTView.h>

@implementation RecyclerRowManager

RCT_EXPORT_MODULE(RecyclerRow)

- (RCTView *)view
{
  return [[RCTView alloc] init];
}

@end
