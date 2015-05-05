//
//  CardReaderManager.m
//  AttendanceTracker
//
//  Created by NYUAD on 4/7/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "MTSCRA.h"
#import "CardReaderManager.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

#define PROTOCOLSTRING @"com.magtek.idynamo"

@implementation CardReaderManager

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(initMagTek:(RCTResponseSenderBlock)callback)
{
  self.magTek = [[MTSCRA alloc] init];
  [self.magTek listenForEvents:(TRANS_EVENT_START|TRANS_EVENT_OK|TRANS_EVENT_ERROR)];
	[self.magTek setDeviceProtocolString:(PROTOCOLSTRING)];
  [self.magTek setDeviceType:(MAGTEKIDYNAMO)];
  callback(@[[NSNull null], @"Initiliazed MagTek iDynamo"]);
}

RCT_EXPORT_METHOD(openMagTek:(RCTResponseSenderBlock)callback)
{
  [self.magTek openDevice];
  [self magTekToggleObservers:true];
  callback(@[[NSNull null], @"Opened MagTek iDynamo"]);
}

RCT_EXPORT_METHOD(closeMagTek:(RCTResponseSenderBlock)callback)
{
  [self magTekToggleObservers:false];
  if (self.magTek != NULL && self.magTek.isDeviceOpened)
  {
    [self.magTek closeDevice];
  }
  callback(@[[NSNull null], @"Closed MagTek iDynamo"]);
}

- (void)magTekToggleObservers:(BOOL) reg {
  NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
  
  if (reg) {
    [nc addObserver:self selector:@selector(transStatusChange:) name:@"trackDataReadyNotification" object:nil];
    [nc addObserver:self selector:@selector(devConnStatusChange) name:@"devConnectionNotification" object:nil];
    [nc addObserver:self selector:@selector(log:) name:@"trackDataReadyNotification" object:nil];
    [nc addObserver:self selector:@selector(log:) name:@"devConnectionNotification" object:nil];
    [nc addObserver:self selector:@selector(log:) name:@"onDataReceived" object:nil];
    [nc addObserver:self selector:@selector(log:) name:@"cardSwipeDidStart" object:nil];
    [nc addObserver:self selector:@selector(log:) name:@"cardSwipeDidGetTransError" object:nil];
    [nc addObserver:self selector:@selector(log:) name:@"onDeviceConnectionDidChange" object:nil];
  }
  else {
    [nc removeObserver:self];
  }
}

-(void)log:(NSNotification *)notification
{
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"Log" body:@{@"msg": notification.userInfo}];
}

- (void)transStatusChange:(NSNotification *)notification
{
  NSNumber *status = notification.userInfo[@"status"];
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"TransStatusChange" body:@{@"status": status}];
  
  switch ([status intValue]) {
    case TRANS_STATUS_OK:
      NSLog(@"TRANS_STATUS_OK");
      [self.bridge.eventDispatcher sendDeviceEventWithName:@"TransStatusChange" body:@{@"data": self.magTek.getResponseData}];
      break;
    case TRANS_STATUS_ERROR:
      NSLog(@"TRANS_STATUS_ERROR");
      break;
    case TRANS_STATUS_START:
      NSLog(@"TRANS_STATUS_START");
      break;
    default:
      NSLog(@"onDataEvent switch default");
      break;
  }
  
  
}

- (void)devConnStatusChange
{
  BOOL isMagTekDeviceConnected = [self.magTek isDeviceConnected];
  BOOL isMagTekDeviceOpen = [self.magTek isDeviceOpened];
  
  if ((self.magTek && isMagTekDeviceConnected && isMagTekDeviceOpen)){
    NSLog(@"Connected");
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"DevConnStatusChange" body:@{@"connected": @true}];
  }
  else {
    NSLog(@"Disonnected");
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"DevConnStatusChange" body:@{@"connected": @false}];
  }
}

RCT_EXPORT_MODULE();


@end
