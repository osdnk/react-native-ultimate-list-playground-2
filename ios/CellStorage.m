//
//  CellStorage.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "CellStorage.h"
#import <React/RCTView.h>

@implementation CellStorageManager

RCT_EXPORT_MODULE(CellStorage)

- (RCTView *)view
{
  return [[RCTView alloc] init];
}

@end
