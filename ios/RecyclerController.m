//
//  RecyclerController.m
//  react-native-multithreading
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerController.h"
#import <React/RCTView.h>


@interface SizeableView : RCTView

@end

@implementation SizeableView

- (void)setBounds:(CGRect)bounds {
  if (self.subviews.count != 0) {
    [((UICollectionView *)self.subviews.firstObject) setFrame:bounds];
  }
  [super setBounds:bounds];
}

@end

@implementation RecyclerController {
  UIRefreshControl *_refreshControl;
}

- (void)viewDidLoad
{
     [super viewDidLoad];
    self.view = [[SizeableView alloc] init];

     UICollectionViewFlowLayout *layout=[[UICollectionViewFlowLayout alloc] init];
    _collectionView=[[UICollectionView alloc] initWithFrame:self.view.frame collectionViewLayout:layout];
    [_collectionView setDataSource:self];
    [_collectionView setDelegate:self];

    [_collectionView registerClass:[UICollectionViewCell class] forCellWithReuseIdentifier:@"cellIdentifier"];
    [_collectionView setBackgroundColor:[UIColor redColor]];


    _refreshControl = [[UIRefreshControl alloc] init];
    _refreshControl.tintColor = [UIColor grayColor];
    [_refreshControl addTarget:self action:@selector(refershControlAction) forControlEvents:UIControlEventValueChanged];
    [_collectionView addSubview:_refreshControl];
    _collectionView.alwaysBounceVertical = YES;
    [self.view addSubview:_collectionView];


    // Do any additional setup after loading the view, typically from a nib.
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return 100;
}



// The cell that is returned must be retrieved from a call to -dequeueReusableCellWithReuseIdentifier:forIndexPath:
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    UICollectionViewCell *cell=[collectionView dequeueReusableCellWithReuseIdentifier:@"cellIdentifier" forIndexPath:indexPath];

    cell.backgroundColor=[UIColor greenColor];
  
    
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    return CGSizeMake(200, 100);
}

-(void)refershControlAction {
  [_refreshControl endRefreshing];
}


@end
