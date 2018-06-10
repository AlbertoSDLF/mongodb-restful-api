import express = require('express');
import { Controller, Inject, UseGuards } from '@nestjs/common';
import { JwtValidationFilter } from '../../filter/JwtValidationFilter';
import { IContactModel } from '../../repository/contact/Contact';
import BaseEntityService from '../../service/BaseEntityService';
import BaseEntityController from '../BaseEntityController';

@Controller('api/contact')
@UseGuards(JwtValidationFilter)
export default class ContactController extends BaseEntityController<IContactModel> {
    constructor(@Inject('ContactService') contactService: BaseEntityService<IContactModel>) {
        super('Contact', contactService);
    }
}

Object.seal(ContactController);