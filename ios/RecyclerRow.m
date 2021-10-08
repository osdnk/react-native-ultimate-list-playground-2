//
//  RecyclerRow.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerRow.h"
#import "CellStorage.h"

@implementation RecyclerRow

-(void)setBounds:(CGRect)bounds {
  [super setBounds:bounds];
  UIView* parent = self.superview.superview;
  if ([parent isKindOfClass:CellStorage.class]) {
    ((CellStorage*) parent).initialRect = bounds;
  }
}

@end


@implementation RecyclerRowManager

RCT_EXPORT_MODULE(RecyclerRow)


- (RCTView *)view
{
  return [[RecyclerRow alloc] init];
}

@end
