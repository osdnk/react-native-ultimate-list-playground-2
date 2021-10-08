//
//  CellStorage.h
//  Pods
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import <React/RCTViewManager.h>
#import <React/RCTView.h>
#import "RecyclerRow.h"

@interface CellStorageManager : RCTViewManager

@end

@class ReusableCell;

@interface CellStorage: RCTView
@property CGRect initialRect;
@property (nonatomic) NSString* type;
- (RecyclerRow *) getFirstAvailableRow;
- (void) enqueueForView:(ReusableCell *)cell;
@end
