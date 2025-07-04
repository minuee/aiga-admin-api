import { Controller, Get, Post, Body, Res, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
const webPush  =  require('web-push')
import { CreateMessageDto } from 'src/chatbot/dtos/CreateMessage.dto';
import * as MockupData from 'src/utils/mockup';

const publicVapidKey = process.env.PUSH_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.PUSH_PUBLIC_VAPID_PRIVATE_KEY;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-notification')
  receiveSendPush(@Body() req: any, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    webPush.setVapidDetails('mailto:minuee@kormedi.com', publicVapidKey, privateVapidKey);
    const subscriptions = [
      {
        endpoint: "https://fcm.googleapis.com/fcm/send/fK8yGm7SOcg:APA91bGlo_czrvHk2XmCPASyxUMrvZEQ3yg9Ntn2Fx0zfGNrydL0HnYb3Kv4eXWxLKD8wXf6KqIrxRpL9p2C2T6Y-FfBWMwlhNQsnEjCeGfCWueayjQg7_3wUickLNo86-Ld0tUVTRX3",
        keys: {
          p256dh: "BOOuyzc9CuEQf26mLhwioh6b2G546O2zAk6sHu2QhQQR-g3xv5mU0N4qkAcSCB3RTk_Qu4sRAvPrMir045E2Vm0",
          auth: "EP9KTfLfYIVPRMvQ3BvWDg"
        }
      },
      {
        endpoint: 'https://web.push.apple.com/QLs8VncrWUY3UG5eDKv3oEcLzq-jY7RAedXdEd7b_QaQVFKf7o6VHOZ6MBm4FPE5hJgnrNDhBVB3gvqIFHUSIJFZBs113k-7gzaishnNtpyGYnGwOHZLrROGm_Ns-AnBQBezq4mqYU2rZijyU_L1khzeqpkDqAc6FJBhzi_7ixc',
        keys: {
          p256dh: 'BFcAmF2usUkyqcNy-ijYWCbbkH7tXnSyaYFdUIrw7guHlkSCza9BVbl4j9FyvTB2gJhYmqHdG98E2B2jUgVvN8M',
          auth: 'UB4nmePBFAtABwdqlDFecQ'
        }
      }      
    ]
    
    try {
      const message = "newssss";//{ message = "newssss"} = req?.body;
      
      const payload = JSON.stringify({
        messageType: 'supplement',
        title: '의사 추천 서비스 AIGA',
        body: 'This is a test push notification',
        icon: '/img/fav/Icon-196.png',
        badge: '/img/fav/Icon-72.png',
        data: {
          url: 'https://aigadev.kormedi.com',
        },
      });

      subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, payload).catch((error:any) => {
          console.error(error.stack);
        });
      });
        
      res.send({
        code : 200,
        success: true
      });
      
    } catch (error) {
      console.log("error",error)
      res.send({
        code : 200,
        success: false
      });
    }
  }

  @Post('chat')
  receiveEvents(@Body() createMessageDto: CreateMessageDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const { user_id,msg_type,msg} = createMessageDto;

      let num = 0;
      let interval = setInterval(() => {
        const data = new Date().toLocaleTimeString();
        const randomText = Math.random().toString(36);
        const randomNumber = Math.floor(Math.random()*110);
        num++
        const retStr = MockupData.testStr[randomNumber] ? MockupData.testStr[randomNumber] : randomText;
        res.write(retStr);
        
        if (num === 1) {
          clearInterval(interval);
          res.end();
        }
      }, 500);
      
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Team not found');
    }
  }
  @Post('chat2')
  receiveEvents2(@Body() createMessageDto: CreateMessageDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const { user_id,msg_type,msg} = createMessageDto;
     
      let num = 0;
      let interval = setInterval(() => {
        const data = new Date().toLocaleTimeString();
        const randomText = Math.random().toString(36);
        const randomNumber = Math.floor(Math.random()*110);
        num++
        const retStr = MockupData.testStr[randomNumber] ? MockupData.testStr[randomNumber] : randomText;
        res.write(retStr);
        
        if (num === 5) {
          clearInterval(interval);
          res.end();
        }
      }, 500);
      
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Team not found');
    }
  }

  @Get('see')
  sendEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    let num = 0;
    try{
      let interval = setInterval(() => {
        const data = new Date().toLocaleTimeString();
        const randomText = Math.random().toString(36);
        const randomNumber = Math.floor(Math.random()*110);
        num++
        const retStr = MockupData.testStr[randomNumber] ? MockupData.testStr[randomNumber] : randomText;
        res.write(retStr);
        
        if (num === 5) {
          clearInterval(interval);
          res.end();
        }
      }, 500);

    }catch(e){
      res.send({
        code : 200,
        success: false
      });
    }
  }
}