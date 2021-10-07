//
//  CellStorage.h
//  Pods
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import <React/RCTViewManager.h>
#import <React/RCTView.h>

@interface CellStorageManager : RCTViewManager

@end

@interface CellStorage : RCTView
@property CGRect initialRect;
@end
