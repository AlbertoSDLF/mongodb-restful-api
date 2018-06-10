import * as express from 'express';
import { Body, Delete, Get, HttpStatus, Param, Post, Put, Request, Response as NestResponse } from '@nestjs/common';
import * as i18n from 'i18n';
import { Document } from 'mongoose';
import DefaultResponse from '../model/response/DefaultResponse';
import BaseEntityService from '../service/BaseEntityService';

export default abstract class BaseEntityController<T extends Document> {
    private entityName: string;
    private service: BaseEntityService<T>;

    constructor(entityName: string, service: BaseEntityService<T>) {
        this.entityName = entityName;
        this.service = service;
    }

    @Post()
    create(@Body() entity: T, @Request() request: express.Request, @NestResponse() response: express.Response) {
        this.service.create(entity, (error, result) => {
            if (error) {
                if (error.name === 'ValidationError') {
                    return response.status(HttpStatus.BAD_REQUEST).send(new DefaultResponse(HttpStatus.BAD_REQUEST, error.message, `${request.method} ${request.path}`));
                }
            } else {
                return response.status(HttpStatus.OK).send(new DefaultResponse(HttpStatus.OK, i18n.__('200.createdId', this.entityName.toLowerCase(), result._id + ''), `${request.method} ${request.path}`));
            }
        });
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() entity: T, @NestResponse() response: express.Response) {
        this.service.update(id, entity, (error, result) => {
            if (error) {
                return response.send({ "error": "error" });
            }
            return response.send({ "success": "success" });
        });
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Request() request: express.Request, @NestResponse() response: express.Response) {
        this.service.delete(id, (error, result) => {
            if (error) {
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(DefaultResponse.generate(HttpStatus.INTERNAL_SERVER_ERROR, `${request.method} ${request.path}`));
            }
            return response.status(HttpStatus.OK).send(new DefaultResponse(HttpStatus.OK, i18n.__('200.deletedId', this.entityName.toLowerCase(), id + ''), `${request.method} ${request.path}`));
        });
    }

    @Get()
    retrieve(@Request() request: express.Request, @NestResponse() response: express.Response) {
        this.service.retrieve((error, result) => {
            if (error) {
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(DefaultResponse.generate(HttpStatus.INTERNAL_SERVER_ERROR, `${request.method} ${request.path}`));
            }
            return response.status(HttpStatus.OK).send(result);
        });
    }

    @Get(':id')
    findById(@Param('id') id: string, @Request() request: express.Request, @NestResponse() response: express.Response) {
        this.service.findById(id, (error, result) => {
            if (error) {
                if (error.name === 'CastError') {
                    return response.status(HttpStatus.BAD_REQUEST).send(new DefaultResponse(HttpStatus.BAD_REQUEST, i18n.__('400.invalidId'), `${request.method} ${request.path}`));
                }
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(DefaultResponse.generate(HttpStatus.INTERNAL_SERVER_ERROR, `${request.method} ${request.path}`));
            }
            if (result == null) {
                return response.status(HttpStatus.NOT_FOUND).send(new DefaultResponse(HttpStatus.NOT_FOUND, i18n.__('404.entityNotFound', this.entityName, id), `${request.method} ${request.path}`));
            }
            return response.status(HttpStatus.OK).send(result);
        });
    }
}