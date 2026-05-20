import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
dotenv.config();

type RollbackPayload = {
  branch: string;
  sha: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getDashboard(): string {
    return readFileSync(join(process.cwd(), 'index.html'), 'utf8');
  }

  @Get('test')
  getTest(): string {
    return 'Test';
  }

  @Post('rollback')
  async rollback(@Body() body: RollbackPayload) {
    if (!body.branch || !body.sha) {
      throw new BadRequestException('branch and sha are required');
    }

    if (!process.env.GITHUB_TOKEN) {
      throw new InternalServerErrorException('GITHUB_TOKEN is not configured');
    }

    try {
      const requestId = randomUUID();
      const urlRollback =
        'https://api.github.com/repos/wintechdeveloper1/Rollback-System/actions/workflows/rollback.yaml/dispatches';
      const actionsUrl =
        'https://github.com/wintechdeveloper1/Rollback-System/actions/workflows/rollback.yaml';
      const response = await fetch(urlRollback, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          ref: body.branch,
          inputs: {
            branch: body.branch,
            sha: body.sha,
            request_id: requestId,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new InternalServerErrorException(
          `GitHub rollback dispatch failed with status ${response.status}: ${errorBody}`,
        );
      }

      return {
        message: 'Rollback initiated successfully',
        githubStatus: response.status,
        requestId,
        actionsUrl,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }
}
