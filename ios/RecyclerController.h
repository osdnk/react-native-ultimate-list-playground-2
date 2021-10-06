//
//  RecyclerController.h
//  react-native-multithreading
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import <Foundation/Foundation.h>


@interface RecyclerController : UIViewController<UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>
{
    UICollectionView *_collectionView;
}
@end
