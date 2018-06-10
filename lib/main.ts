import { NestFactory } from '@nestjs/core';
import * as i18n from 'i18n';
import { AppModule } from './app.module';
import mongoose = require('mongoose');

async function bootstrap() {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/nodejs-test');

    i18n.configure({
        locales: ['en'],
        directory: 'messages'
    });

    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();