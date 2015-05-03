//
//  CardReaderManager.m
//  AttendanceTracker
//
//  Created by NYUAD on 4/7/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "MTSCRA.h"
#import "CardReaderManager.h"

@implementation CardReaderManager
#pragma mark -
#pragma mark MTSCRA Library Method
#pragma mark -
- (MTSCRA *)getSCRALib
{
    return [self mtSCRALib];
}

#define PROTOCOLSTRING @"com.magtek.idynamo"


RCT_EXPORT_METHOD(test:(RCTResponseSenderBlock)callback)
{
  NSString *msg = @"test";
  self.mtSCRALib = [[MTSCRA alloc] init];
  [self.mtSCRALib listenForEvents:(TRANS_EVENT_START|TRANS_EVENT_OK|TRANS_EVENT_ERROR)];
  [self.mtSCRALib setDeviceType:(MAGTEKIDYNAMO)];
	[self.mtSCRALib setDeviceProtocolString:(PROTOCOLSTRING)]; [self.mtSCRALib setDeviceType:(MAGTEKIDYNAMO)];
  [self.mtSCRALib openDevice];
  callback(@[[NSNull null], msg]);
}

RCT_EXPORT_MODULE();


@end
