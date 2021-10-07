//
//  RecyclerController.h
//  react-native-multithreading
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTView.h>


@interface RecyclerController : UIViewController<UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>
{
    UICollectionView *_collectionView;
}
@end

@interface SizeableView: RCTView

@property (nonatomic, readonly) NSNumber* identifier;
// TODO osdnk dealloc
@property (nonatomic, strong) RecyclerController* controller;

@end
