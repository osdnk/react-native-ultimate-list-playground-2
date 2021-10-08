//
//  RecyclerController.h
//  react-native-multithreading
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTView.h>
#import "CellStorage.h"

@interface RecyclerController : UIViewController<UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>
{
    UICollectionView *_collectionView;
}
@property (nonatomic) NSMutableDictionary<NSString*, CellStorage *> *cellStorages;
@end

@interface SizeableView: RCTView

@property (nonatomic, readonly) NSNumber* identifier;
// TODO osdnk dealloc
@property (nonatomic, strong) RecyclerController* controller;

@end

@interface ReusableCell: UICollectionViewCell
@property (nonatomic) NSString* type;
@property (nonatomic) NSInteger index;
@property (nonatomic) RecyclerController* controller;
- (void)recycle:(NSInteger)index;
- (void)notifyNewViewAvailable;
@end
