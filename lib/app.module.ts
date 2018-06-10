import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import ContactController from './controller/contact/ContactController';
import HttpExceptionFilter from './filter/HttpExceptionFilter';
import ContactRepository from './repository/contact/ContactRepository';
import ContactService from './service/contact/ContactService';

@Module({
    controllers: [ContactController],
    providers: [ContactRepository, ContactService, {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter
    }]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // consumer
        //    .apply(JwtValidationFilter)
        //    .forRoutes(ContactController);
    }
}