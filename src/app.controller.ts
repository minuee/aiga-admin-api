import { Controller, Get, Post, Body, Res, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { CreateMessageDto } from 'src/chatbot/dtos/CreateMessage.dto';
import * as MockupData from 'src/utils/mockup'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('chat')
  receiveEvents(@Body() createHospitalDto: CreateMessageDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    
    try {
      const { user_id,msg_type,msg} = createHospitalDto;
      console.log("createHospitalDto",createHospitalDto)

      let num = 0;
      let interval = setInterval(() => {
        const data = new Date().toLocaleTimeString();
        const randomText = Math.random().toString(36);
        const randomNumber = Math.floor(Math.random()*110);
        console.log("data : ",num, randomText, randomNumber,MockupData.testStr[randomNumber])
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
  receiveEvents2(@Body() createHospitalDto: CreateMessageDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    
    try {
      const { user_id,msg_type,msg} = createHospitalDto;
      console.log("createHospitalDto",createHospitalDto)

      let num = 0;
      let interval = setInterval(() => {
        const data = new Date().toLocaleTimeString();
        const randomText = Math.random().toString(36);
        const randomNumber = Math.floor(Math.random()*110);
        console.log("data : ",num, randomText, randomNumber,MockupData.testStr[randomNumber])
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
        console.log("data : ",num, randomText, randomNumber,MockupData.testStr[randomNumber])
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
