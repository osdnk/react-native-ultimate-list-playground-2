//
//  RecyclerList.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerList.h"
#import <React/RCTView.h>

@implementation RecyclerListManager {
  // TODO make view strong holding
  RecyclerController * rc;
}


// temp
 

// /temp

RCT_EXPORT_MODULE(RecyclerListView) // TODO osdnk rename to RecyclerList

- (UIView *)view
{
  //return [[RCTView alloc] init];
  //rc = [[RecyclerController alloc] init];
  RCTView* view = [RCTView new];
  rc = [[RecyclerController alloc] init];
  //rc.view = view;
  return rc.view;
}

@end
