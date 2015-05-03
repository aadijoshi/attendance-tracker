//
//  CardReaderManager.h
//  AttendanceTracker
//
//  Created by NYUAD on 4/7/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@class MTSCRA;

@interface CardReaderManager : NSObject <RCTBridgeModule>

#pragma mark -
#pragma mark MTSCRA Property
#pragma mark -

@property (nonatomic, strong) MTSCRA *mtSCRALib;

@end
