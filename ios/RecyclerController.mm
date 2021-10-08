//
//  RecyclerController.m
//  react-native-multithreading
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "RecyclerController.h"
#import <React/RCTView.h>
#import "UltimateListInstaller.h"
#import <objc/runtime.h>


#define REUSABLE_CELL "ReusableCell"


@implementation ReusableCell {
  BOOL _enqueued;
}

- (void)reparentIfNeeded {
  if (self.subviews.count == 0) {
    CellStorage* storage = [self.controller.cellStorages valueForKey:self.type];
    RecyclerRow* row = [storage getFirstAvailableRow];
    if (row != nil) {
      [row removeFromSuperview];
      [self addSubview:row];
    } else {
      if (!_enqueued) {
        [storage enqueueForView:self];
        _enqueued = YES;
      }
    }
  }
}

- (void)recycle:(NSInteger)index {
  [self reparentIfNeeded];
  _index = index;
    
}

- (void)notifyNewViewAvailable {
  [self reparentIfNeeded];
}

- (instancetype)initWithFrame:(CGRect)rect
{
  self = [super initWithFrame: rect];
  if (self) {
    NSString * classNameWrapper = NSStringFromClass([self class]);
    NSString * className = [classNameWrapper substringWithRange:NSMakeRange(0, classNameWrapper.length - sizeof(REUSABLE_CELL) + 1)];
    _type = className;
  }
  return self;
}

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
  SizeableView *_config;
}


- (instancetype)init {
  self = [super init];
  if (self) {
    self.cellStorages = [NSMutableDictionary new];
  }
  return self;
}

- (void)viewDidLoad
{
  [super viewDidLoad];
  _config = [[SizeableView alloc] init];
  self.view = _config;
  
  UICollectionViewFlowLayout *layout=[[UICollectionViewFlowLayout alloc] init];
  _collectionView=[[UICollectionView alloc] initWithFrame:self.view.frame collectionViewLayout:layout];
  [_collectionView setDataSource:self];
  [_collectionView setDelegate:self];
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
  return osdnk::ultimatelist::obtainCount(_config.identifier.intValue);
}



// The cell that is returned must be retrieved from a call to -dequeueReusableCellWithReuseIdentifier:forIndexPath:
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
  std::string type = osdnk::ultimatelist::obtainTypeAtIndexByKey((int)indexPath.item, _config.identifier.intValue);
  NSString* wrappedType = [NSString stringWithCString:type.c_str()
                                             encoding:[NSString defaultCStringEncoding]];
  
  
  NSInteger idx = indexPath.item;
  ReusableCell *cell=[collectionView dequeueReusableCellWithReuseIdentifier:wrappedType forIndexPath:indexPath];
  cell.controller = self;
  
  
  cell.backgroundColor=[UIColor greenColor];
  [cell recycle:idx];
  
  return cell;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section {
  return 0.0;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section {
  return 0.0;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
  std::string type = osdnk::ultimatelist::obtainTypeAtIndexByKey((int)indexPath.item, _config.identifier.intValue);
  NSString* wrappedType = [NSString stringWithCString:type.c_str()
                                             encoding:[NSString defaultCStringEncoding]];
  
  if ([self.cellStorages valueForKey:wrappedType] == nil) {
    NSArray<UIView *> * cellStorages = self.view.reactSuperview.reactSubviews;
    for (UIView* maybeCellStorage: cellStorages) {
      if ([maybeCellStorage isKindOfClass:CellStorage.class] && [((CellStorage *) maybeCellStorage).type isEqualToString: wrappedType]) {
        [self.cellStorages setValue:(CellStorage *) maybeCellStorage forKey:wrappedType];
        char typeChars[type.length()];
        strcpy(typeChars, type.c_str());
        char* result;
        result=(char*)malloc(sizeof(typeChars) + sizeof(REUSABLE_CELL) );
        memcpy(result, typeChars, sizeof(typeChars));
        memcpy(result+sizeof(typeChars), REUSABLE_CELL, sizeof(REUSABLE_CELL));
        Class newClass = objc_allocateClassPair(objc_getClass(REUSABLE_CELL), result, 0);
        [_collectionView registerClass:newClass forCellWithReuseIdentifier:wrappedType];
      }
    }
  }
  
  CGRect rect = [self.cellStorages valueForKey:wrappedType].initialRect;
  
  
  // TODO osdnk
  return CGSizeMake(rect.size.width, rect.size.height);
}

-(void)refershControlAction {
  [_refreshControl endRefreshing];
}


@end
