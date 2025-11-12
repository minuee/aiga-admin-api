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
  async receiveSendPush(@Body() req: any, @Res() res: Response) {
    webPush.setVapidDetails('mailto:minuee@kormedi.com', publicVapidKey, privateVapidKey);
    const subscriptions = [
      /* {
        "endpoint":"https://web.push.apple.com/QLRQsViD6h3ulWtK4PROad7IgFzAeLW_P7QXUabwlTZnDDZq_l2fVNZPxLF9yci1w0h-FUWHErsQ9-cHFp5VjDMFlFVgW39bYpiIQvuWVEwpq-AmH3JZPJpYirpiQQ9-NVq1vEUcleye46xGZXps28aqxak0_PPiNUrYbv-aZ-E",
        "keys":{"p256dh":"BNf4ksDv2kdTVKJeDXEXsRY82c6muX_C8IfiIWghk_N-WNUvAP-otG4XEICFFjHTUNfEzXL6-qb3QIYqMzRK4nA","auth":"Tqvbn9KQ5YjbHtUZfXRmSA"}
      },
      {
        "endpoint":"https://web.push.apple.com/QLrm9df4O0xneM5zaxVRuGq3d4R4arFsmcdCSOM5Abqs5INdDeswv7FvNy33W8e3zNnVd9YLJRIA37W5GbjiBuod4mcjZPRsjM3eBLOTEnKxNr2MeU96aUkddvQql8LHMuhnA0X5Co2dI06jpdLd5r2UOckDlx7LNTdpiXm3x2I","keys":{"p256dh":"BBrcnchNEr_tTAW-VxKK7FPnMSVb5pj-BE39WJvxplUXAh1AQ8cOa826QARwUD8hhoMfVR7LRzX4kS-RhiQdH9s","auth":"3UKdL1_f2NrAU4eSKsS0vQ"}
      }, */
      /* {
        "endpoint":"https://fcm.googleapis.com/fcm/send/eZuEfJOn2M4:APA91bFCDrNmws1kLyaI7aUfeYr8Cz0w6xCCB7PpNDfpLSsLf2OSoV28ssw0i6IrLve18NacPJk-0av255slR4ySF_2kBNpWUbfJheeAB8-AXm_i7LIIpqq2qykf3lCTcBIddHf0bZgK",
        "expirationTime":null,"keys":{"p256dh":"BHEt7ufqtVsRpaOoSuAPNPCa0pn-BPcyHdkuCp6MKkOcLuGhzjo2ZEZbtbbI3q2REBGW6TXd8WyGBhmX0JnjyZ8","auth":"d6ijCu7tMyLrLmgG49P-cA"}
      },
      {
        "endpoint":"https://fcm.googleapis.com/fcm/send/f8hzSflyPfA:APA91bF8YLBIkxKjqxDRHMzVMfCOKx-f9QPnyq4W7scJKJwevYKsYmFSHCUe-KuVja30NmVUpOLvrAffc2dEDCHGLE90sYDEpNu6QQPC_aRc1Vg_pmSn6S-5ev6SaSuNlnxHSA83jh9W","expirationTime":null,"keys":{"p256dh":"BOFipdmaHkAVak7XfVyXtwUL-9WuWJVDfCqmS03eIsfoM5bFhy3kWYxunAmnXqXZ90A2Ow-WS94Rl_XC3E-xdEo","auth":"VxgjHFyekB7uIPRoYloJJQ"}
      }, */
      /* {
        "endpoint":"https://web.push.apple.com/QNiSyPyX0671JyJS_EaeOEh-PlWNAIw-7jDM2valC6toW48OdNVezT2IXabYUnHMhrc6jLF64IcUmgGC-IyogtAH3q8vFnLt62gJSjAla44aSIQG0KR21f0FJiZN24nBwg655wwdLvPYWIVW0xyCtfJgXxorWSWbjO9u1tBmOIE",
        "keys":{"p256dh":"BDvqdsG2B_gXlas0fqOUdFmzHnVvJNdKZVZiLoivqElpxwDryYmD7xWgHyMqKo_1V2g5Nv8s89q6dYaLbNsHvrQ","auth":"myULUwK2p_kgr8256dUIFw"}
      },
      {
        "endpoint":"https://web.push.apple.com/QMytXB4B1ynFy2nzmsVWXpBaUJ3bVJq0zkLjIUT0VDR6EfMHe9erMfqF4ze-IX8ho0sFwLshBrK-exXOgwZjavx4uA_wqbpVgs1DNHPmfs6i5PSdaIps_lYZUsmEWfBIsiW9KKky8942yZ5EqgKqJw79qNB1JXKM-WlCx6UWN4s","keys":{"p256dh":"BKCiwVlz5QEAD6FL9CNo8k_4fIb46gdvKQjEbAtlhpNca21cU4kPK-DFrPrQYHI3oqCHUQSAmeEk80GPXzcqQ3I","auth":"myjE9XccYJ6sJ2wgTpUukQ"}
      }, */
     /*  {
        "endpoint":"https://fcm.googleapis.com/fcm/send/ccHRjAsbdW4:APA91bE5LH-qlCt-0djmO8eYAscf0zj8bf1Rdf7aSiMtEgYPcBvuvgKHmOhu6kds9aaOhwwTXHTd6hzCrrWF4XPc0oR50EUlc8datr2etKoWEG4Qx98SoX-3mIb4jKaVfUVg_ZgQAHr2","expirationTime":null,"keys":{"p256dh":"BDGi5Ou-d5ge2Eq-TxEPXjKKZ444_ibcnrvJZUUIZ-0U5ifARGTDEkEK6y5MIzyC7EMfT4o2nhicxPlimWxtRJ8","auth":"cNOCJZvRtVA0GBBahK905Q"}
      }, */
      {"endpoint":"https://web.push.apple.com/QCb2AkYP16YGSvv6GCy66lwH1CfsNm_kyaRmr2iPKfd49gkzc51VcNRFFB4OzR0ebOPu9dl1RJHMiX2EvTJGlu527GwzBgutLorLiXSQyhxi94R5kBhqkhhv2tqCoK5v6WFUivVqF5pVfDmZfXOqeuXsEiNK9j1xJWrnsJspYZ8","keys":{"p256dh":"BB3pVmRn5FA8qfx1NyJT8hWwTNzXs_5uWhUtRLL0wVlNywEWNe1SFsU5HES5GW5UCC8kzppGkOx2NWyZ0qDwYCU","auth":"Laf77f_FvRpUZWDiSTveCA"}}
    ]

    const payload = JSON.stringify({
      messageType: 'supplement',
      title: '의사 추천 서비스 AIGA',
      body: 'This is a test push notification',
      icon: '/img/fav/Icon-196.png',
      badge: '/img/fav/Icon-72.png',
      data: {
        url: 'https://aigadev.kormedi.com/ko',
      },
    });
    let errorCount = 0;
   /*  
    subscriptions.forEach(async (subscription) => {
      try {
        await webPush.sendNotification(subscription, payload);
      } catch (error) {
        console.error('푸시 전송 실패:', error);
        errorCount++;
        // 예: 410 Gone 이면 구독 제거 처리
        if (error.statusCode === 410 || error.statusCode === 404) {
          // DB에서 구독 삭제 로직 호출
          console.log('만료된 구독 발견, 삭제 처리 필요');
        }
      }
    }); */
    for (const subscription of subscriptions) {
      try {
        await webPush.sendNotification(subscription, payload);
      } catch (error: any) {
        console.error('푸시 전송 실패:', error);
        errorCount++;
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log('만료된 구독 발견, 삭제 처리 필요');
          // 구독 삭제 로직 실행
        }
      }
    }
    console.log(`발송건수 : ${errorCount}건`);
    res.send({
      code : 200,
      success: errorCount == 0 ? true : false,
      message : errorCount == 0 ? '전부발송완료' : `발송실패 : ${errorCount}건`
    });

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

