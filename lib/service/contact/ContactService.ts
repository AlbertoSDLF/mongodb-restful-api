import { Inject } from '@nestjs/common';
import { IContactModel } from '../../repository/contact/Contact';
import ContactRepository from '../../repository/contact/ContactRepository';
import BaseEntityService from '../BaseEntityService';

export default class ContactService extends BaseEntityService<IContactModel> {
    constructor(@Inject('ContactRepository') contactRepository: ContactRepository) {
        super(contactRepository);
    }
}

Object.seal(ContactService);