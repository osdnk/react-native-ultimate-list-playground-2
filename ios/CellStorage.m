//
//  CellStorage.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "CellStorage.h"
#import <React/RCTView.h>

@implementation CellStorage


@end

@implementation CellStorageManager

RCT_EXPORT_MODULE(CellStorage)

- (RCTView *)view
{
  return [[CellStorage alloc] init];
}

@end
