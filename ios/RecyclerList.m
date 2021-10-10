//
//  RecyclerList.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerList.h"
#import <React/RCTView.h>

@implementation RecyclerListManager

RCT_EXPORT_MODULE(RecyclerListView) // TODO osdnk rename to RecyclerList
RCT_EXPORT_VIEW_PROPERTY(identifier, NSNumber);

- (UIView *)view
{
  RecyclerController* rc = [[RecyclerController alloc] init];
  ((SizeableView* )rc.view).controller = rc;
  return rc.view;
}

@end
