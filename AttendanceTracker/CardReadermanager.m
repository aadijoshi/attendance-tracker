//
//  CardReaderManager.m
//  AttendanceTracker
//
//  Created by NYUAD on 4/7/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "CardReaderManager.h"

@implementation CardReaderManager

- (void)test:(RCTResponseSenderBlock)callback
{
  RCT_EXPORT();
  NSString *msg = @"test";
  callback(@[[NSNull null], msg]);
}

@end
