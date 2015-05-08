//
//  CardReaderManager.m
//  AttendanceTracker
//
//  Created by NYUAD on 4/7/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "CardReaderManager.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"


@implementation CardReaderManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(initMagTek)
{
  self.magTek = [[MTSCRA alloc] init];
  [self.magTek listenForEvents:(TRANS_EVENT_START|TRANS_EVENT_OK|TRANS_EVENT_ERROR)];
  [self magTekToggleObservers:true];
  [self.magTek setDeviceType:MAGTEKIDYNAMO];
  [self.magTek setDeviceProtocolString:(@"com.magtek.idynamo")];
  [self.magTek openDevice];
  [self.magTek closeDevice];
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                  body:@{
                                                         @"msg": @"Initialized iDynamo",
                                                         @"caller":@"initMagTek",
                                                         }];
}

RCT_EXPORT_METHOD(updateConnStatus)
{
  BOOL isDeviceConnected = [self.magTek isDeviceConnected];
  BOOL isDeviceOpened = [self.magTek isDeviceOpened];
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                  body:@{
                                                         @"caller":@"updateConnStatus",
                                                         @"isDeviceConnected": @(isDeviceConnected),
                                                         @"isDeviceOpened": @(isDeviceOpened),
                                                         }];
}

RCT_EXPORT_METHOD(openDevice)
{
  if (![self.magTek isDeviceOpened] && [self.magTek isDeviceConnected])
  {
    BOOL isOpened = [self.magTek openDevice];
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                    body:@{
                                                           @"caller":@"openDevice",
                                                           @"isOpened":@(isOpened),
                                                           }];
  }
}


RCT_EXPORT_METHOD(closeDevice)
{
  if ([self.magTek isDeviceOpened])
  {
    [self magTekToggleObservers:false];
    [self.magTek clearBuffers];
    BOOL isClosed = [self.magTek closeDevice];
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                    body:@{
                                                           @"caller":@"closeDevice",
                                                           @"isClosed":@(isClosed),
                                                           }];
  }
}

- (void)trackDataReady:(NSNotification *)notification
{
  NSNumber *status = [[notification userInfo] valueForKey:@"status"];
  switch ([status intValue]) {
    case TRANS_STATUS_OK:
      [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                      body:@{
                                                             @"caller":@"trackDataReady",
                                                             @"status":@"TRANS_STATUS_OK",
                                                             }];
      break;
    case TRANS_STATUS_ERROR:
      [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                      body:@{
                                                             @"caller":@"trackDataReady",
                                                             @"status":@"TRANS_STATUS_ERROR",
                                                             }];
      break;
  }
  [self.magTek clearBuffers];
}
-(void)onDataEvent:(id)status
{
  
}

- (void)magTekToggleObservers:(BOOL) reg {
  
  if (reg) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(updateConnStatus)
                                                 name:@"devConnectionNotification" object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(trackDataReady:)
                                                 name:@"trackDataReadyNotification" object:nil];
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                    body:@{
                                                           @"caller":@"magTekToggleObservers",
                                                           @"msg":@"added observers",
                                                           }];
  }
  else {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log"
                                                    body:@{
                                                           @"caller":@"magTekToggleObservers",
                                                           @"msg":@"removed observers",
                                                           }];
  }
}

@end
