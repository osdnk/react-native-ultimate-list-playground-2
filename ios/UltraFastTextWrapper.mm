//
//  RecyclerRow.m
//  CocoaAsyncSocket
//
//  Created by Michał Osadnik on 06/10/2021.
//

#import "UltraFastTextWrapper.h"
#import <React/RCTView.h>
#import <React/RCTTextView.h>
#import "UltimateListInstaller.h"
#import "RecyclerController.h"
#import <React/RCTSinglelineTextInputView.h>

@implementation UltraFastTextWrapper

- (void)notifyNewData:(NSInteger)index {
  UIView* maybeTextView = self.subviews.firstObject;
  if ([maybeTextView isKindOfClass:RCTSinglelineTextInputView.class]) {
    RCTSinglelineTextInputView *textView = ((RCTSinglelineTextInputView*) maybeTextView);
    
    NSNumber* identifier = self.boundRow.config.identifier;;
    if (identifier != nil) {
      int listId = identifier.intValue;
      std::string newText = osdnk::ultimatelist::obtainStringValueAtIndexByKey((int)index, self.binding.UTF8String, listId);
      NSString* newTextWrapped = [NSMutableString stringWithUTF8String:newText.c_str()];
      // TODO osdnk fixme 
      [textView setAttributedText:[[NSAttributedString alloc] initWithString:newTextWrapped]];
      
  
//      NSString* newTextWrapped = [NSMutableString stringWithUTF8String:newText.c_str()];
//
//      NSTextStorage *textStorage2 = [[NSTextStorage alloc] initWithString:@"XXXX" attributes:text];
      
      //[NSTextStorage alloc] initWithString:<#(nonnull NSString *)#>
//      [textStorage beginEditing];
//      [textStorage replaceCharactersInRange:NSRangeFromString(textStorage.string) withString:newTextWrapped];
//      [textStorage endEditing];
//      [textView setTextStorage:textStorage2 contentFrame:*rect descendantViews:descendantViews];
    }
  }
}

@end

@implementation UltraFastTextWrapperManager

RCT_EXPORT_MODULE(UltraFastTextWrapper)
RCT_EXPORT_VIEW_PROPERTY(binding, NSString)

- (RCTView *)view
{
  return [[UltraFastTextWrapper alloc] init];
}

@end
