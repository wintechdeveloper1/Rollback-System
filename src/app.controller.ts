import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): string {
    return 'Test';
  }

  @Post('rollback')
  async rollback(@Body() body: { branch: string, sha: string }) {
    try {
      const urlRollback = `https://api.github.com/repos/wintechdeveloper1/Rollback-System/actions/workflows/rollback.yml/dispatches`
      const response = await fetch(urlRollback, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: body.branch,
          inputs: { sha: body.sha },
        }),
      })

      console.log("ini error yaa :)")
      return {
        message: 'Rollback initiated successfully',
        response
      }
    } catch (error) {
      throw new InternalServerErrorException(error) 
    }
  }
}
