import { Injectable } from '@nestjs/common';
import BaseRepository from '../BaseRepository';
import { ContactModel, IContactModel } from './Contact';

@Injectable()
export default class ContactRepository extends BaseRepository<IContactModel> {
    constructor() {
        super(ContactModel);
    }
}

Object.seal(ContactRepository);