//
//  CellStorage.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "CellStorage.h"
#import <React/RCTView.h>
#import "RecyclerController.h"

@interface NSMutableArray (QueueAdditions)
- (id) dequeue;
@end

@implementation NSMutableArray (QueueAdditions)
- (id) dequeue {
  id headObject = [self objectAtIndex:0];
  if (headObject != nil) {
    [self removeObjectAtIndex:0];
  }
  return headObject;
}
@end


@implementation CellStorage {
  NSMutableArray<ReusableCell *> *_viewsQueue;
}

- (RecyclerRow *) getFirstAvailableRow {
  for (UIView* child in self.subviews) {
    if (child.subviews.count == 1) {
      return (RecyclerRow *) child.subviews.firstObject;
    }
  } 
  return nil;
}

- (void) enqueueForView:(ReusableCell*)cell {
  [_viewsQueue addObject:cell];
}

- (void)addSubview:(UIView *)view {
  [super addSubview:view];
  ReusableCell* cell = [_viewsQueue dequeue];
  if (cell != nil) {
    [cell notifyNewViewAvailable];
  }
}

@end

@implementation CellStorageManager

RCT_EXPORT_MODULE(CellStorage)
RCT_EXPORT_VIEW_PROPERTY(type, NSString)

- (RCTView *)view {
  return [[CellStorage alloc] init];
}


@end
