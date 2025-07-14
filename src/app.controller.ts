import { Controller, Query, Get, Post, Delete, Body, Res, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
const webPush  =  require('web-push')
import { CreateMessageDto } from 'src/chatbot/dtos/CreateMessage.dto';
import * as MockupData from 'src/utils/mockup';
import { DataSource } from 'typeorm';

const publicVapidKey = process.env.PUSH_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.PUSH_PUBLIC_VAPID_PRIVATE_KEY;

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('log')
  async receiveLogs(@Body() body: any, @Res() res: Response) {
    try {
      const { session_id,user_id, user_email,user_agent, user_message,error_message, error_code } = body;
      if ( session_id != null ) {
        // SQL 쿼리 실행
        const timestamp = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await this.dataSource.query(
          `
          INSERT INTO errorlog (
            user_id,
            user_email,
            session_id,
            user_agent,
            user_message,
            error_message,
            error_code,
            create_dt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            user_id || null,
            user_email || null,
            session_id || null,
            user_agent || null,
            user_message || null,
            error_message || null,
            error_code || null,
            timestamp || null,
          ],
        );
        res.status(201).json({ success: true ,msg:'등록완료'});
      }else{
        res.status(201).json({ success: true , msg:"값이 없음" });
      }

      
    } catch (error) {
      console.error("로그 저장 오류:", error);
      throw new NotFoundException('로그 저장 실패');
    }
  }

  @Post('subscribe')
  async registSubscribe(@Body() body: any, @Res() res: Response) {
    try {
      const { user_id, user_email,user_agent, endpoint,scribe_key } = body;
      if ( endpoint != null ) {
        // SQL 쿼리 실행
        const timestamp = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await this.dataSource.query(
          `
          INSERT INTO pwalog (
            user_id,
            user_email,
            user_agent,
            endpoint,
            scribe_key,
            create_dt
          ) VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            user_id || null,
            user_email || null,
            user_agent || null,
            endpoint || null,
            scribe_key || null,
            timestamp || null,
          ],
        );
        res.status(201).json({ success: true ,msg:'등록완료'});
      }else{
        res.status(201).json({ success: true , msg:"값이 없음" });
      }
    } catch (error) {
      console.error("로그 저장 오류:", error);
      throw new NotFoundException('로그 저장 실패');
    }
  }

  @Delete('subscribe')
  async removeSubscribe(@Query('key') endpoint: string, @Res() res: Response) {
    try {
      if (endpoint) {
  
        await this.dataSource.query(
          `
          DELETE FROM pwalog
          WHERE endpoint = ?
          `,
          [endpoint],
        );
  
        res.status(200).json({ success: true, msg: '삭제 완료' });
      } else {
        res.status(400).json({ success: false, msg: 'endpoint 값이 없습니다.' });
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      throw new NotFoundException('삭제 실패');
    }
  }

  @Post('send-notification')
  receiveSendPush(@Body() req: any, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    webPush.setVapidDetails('mailto:minuee@kormedi.com', publicVapidKey, privateVapidKey);
    const subscriptions = [
      {
        "endpoint":"https://fcm.googleapis.com/fcm/send/fm2hmlT7kQc:APA91bEec-rldnEMPg8p1VROJc9uH7iRiGyc8PYpS3sbjYwOnslPVpxsS3zQdG5vGaeRY5emg25Q2x-JJZoaw1VwK-jFk_jUM-L8y4OzC2jf4Pwlv_GsTRx2hJ2-f_AGCkYmbHu33Fcc","expirationTime":null,
        "keys":{"p256dh":"BLP9eodLTiR-bocEKK7QfcY48aY6gF8wD3IS0T31KaDTUEnF7ovM6S__y2fTDTcPeF01yUk02r9Iw5T-sIN1N6E","auth":"hlAOjAgd-RY7VfBVVvNigQ"}
      },
      {
        "endpoint": "https://jmt17.google.com/fcm/send/dzOvj0_24MY:APA91bFyLgMsl2_1lH5Z9j7H332RKjx0l-3jXdejY6lRFWKj588EJL5sIzxqADfTvpzAYGe_SXo7wLUejo1BIQCdNYsYcjx_plgU4axPwL-CZEar_uCdmtlunK_9SnHe0cMf9yLyc0oL",
        "expirationTime": null,
        "keys": {
            "p256dh": "BGY1vPeZs_inj8-BOvkkj0B_oxzGq0Yz1U3ZhPT244nEu-24fMfVNL00PtVbUoFqsVKXao1LrECxIR7mLBfGwhU",
            "auth": "fGKiWrW45OEtuLJ_AicVjg"
        }
      },
      {
        "endpoint":"https://web.push.apple.com/QFr87S555VSGrHFELyZEgRaV-PwtNTWavloQnibgibIvGjgEINYkm0xTcMHPSqeVwHIq5oPHCsZimc0WPw_iKa0GzYwEk-Tz1zcBcGO6kNuEeO2OffvZMQ_TssCKqtkXMbaYQAoxfbaXtRiepUk9b3I9vGykE36-PAPzjp2xiFQ",
        "keys":{
          "p256dh":"BACuKPYHdfIqzucW6eWUSMhOgzC6YVKMKPMYQTxv8EM3uR2yl0Dvsd-CtElKOggk_OYVGLK8KkIn4QvNrizDnSI",
          "auth":"aHvOxmUls-aOITmxotnATg"
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
          url: 'https://aigadev.kormedi.com/ko/chat',
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

