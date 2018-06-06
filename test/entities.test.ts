import * as chai from 'chai';
import app from '../lib/app';

chai.use(require('chai-http'));
const expect = chai.expect;

const entities = [
    {
        name: 'Contact',
        path: '/api/contact',
        data: { first_name: 'Test', last_name: 'Test' },
        validationErrorData: { first_name: 'Test' }
    }
];

entities.forEach(function (entity) {
    let createdId: string;
    describe(entity.name, () => {
        describe('POST', () => {
            it(`should create a new ${entity.name}`, async function () {
                await chai.request(app).post(entity.path).send(entity.data).then(result => {
                    expect(result.type).to.equal('application/json');
                    expect(result.status).to.equal(201);
                    expect(result.body).to.have.property('_id');
                    createdId = result.body._id;
                });
            });
            if (entity.validationErrorData !== null) {
                it('should return validation errors', async function () {
                    await chai.request(app).post(entity.path).send(entity.validationErrorData).then(result => {
                        expect(result.type).to.equal('application/json');
                        expect(result.status).to.equal(400);
                        expect(result.body).to.have.property('more_information').and.to.contain('failed');
                    });
                });
            }
        });
        describe('GET :id', () => {
            it(`should return an existing ${entity.name}`, async function () {
                await chai.request(app).get(`${entity.path}/${createdId}`).then(result => {
                    expect(result.type).to.equal('application/json');
                    expect(result.status).to.equal(200);
                    expect(result.body).to.have.property('_id').and.to.equal(createdId);
                });
            });
            it('should return invalid id error', async function () {
                await chai.request(app).get(`${entity.path}/1`).then(result => {
                    expect(result.type).to.equal('application/json');
                    expect(result.status).to.equal(400);
                    expect(result.body).to.have.property('more_information').and.to.equal('The specified id is invalid');
                });
            });
        });
        describe('GET', () => {
            it(`should return all existing ${entity.name}`, async function () {
                await chai.request(app).get(`${entity.path}`).then(result => {
                    expect(result.type).to.equal('application/json');
                    expect(result.status).to.equal(200);
                    expect(result.body).to.be.an.instanceof(Array).and.to.have.length.gte(1);
                    const ids: String[] = [];
                    result.body.forEach(function (resultEntity) {
                        ids.push(resultEntity._id);
                    });
                    expect(ids).to.include(createdId);
                });
            });
        });
    });
    after(function () {
        process.exit();
    });
});