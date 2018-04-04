const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const server = require('../../config/app').domain
const mongoose = require('mongoose')

let databaseConfig = require('../../config/database.test.js')
mongoose.connect(databaseConfig, { useMongoClient: true })

const Password = require('../../model/Password')

chai.use(chaiHttp);

let token = ''

describe('Password', () => {
    beforeEach(async () => {
        let mongooseRet = await Password.remove({})

        let res = await chai.request(server)
            .post('/auth')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: 'TestAPI',
                password: 'Test'
            })
        assert.equal(res.status, 200)
        token = res.body.token
    })
    describe('GET /user/passwords', () => {
        it ('Should return a list of passwords', async () => {
            let password1 = new Password({
                serviceName: 'Test1',
                password: 'Test1',
                owner: '5ac295e62b9d5d7328fdf7ef'
            })
            let res1 = await password1.save()
            let password2 = new Password({
                serviceName: 'Test2',
                password: 'Test2',
                owner: '5ac295e62b9d5d7328fdf7ef'
            })
            let res2 = await password2.save()
            let password3 = new Password({
                serviceName: 'Test3',
                password: 'Test3',
                owner: '5ac295e62b9d5d7328fdf7ef'
            })
            let res3 = await password3.save()

            let res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 3)
        })

        it('Should return an empty list of passwords', async () => {
            let res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 0)
        })

        it('Cannot get password if no token', async () => {
            let res = await chai.request(server)
                .get('/user/passwords')
            assert.equal(res.status, 401)
        })
    })

    describe('GET /:id/password', () => {
        let password
        beforeEach(async () => {
            password = new Password({
                serviceName: 'Test1',
                password: 'Test1',
                owner: '5ac295e62b9d5d7328fdf7ef'
            })
            let res1 = await password.save()
        })

        it('Sould return a password object', async () => {
            let res = await chai.request(server)
                .get('/'+ password._id +'/password')
                .set('Authorization', token)

            assert.equal(res.status, 200)
            assert.equal(res.body.serviceName, 'Test1')
            assert.equal(res.body.password, 'Test1')
            assert.equal(typeof res.body.owner, 'object')
            assert.equal(res.body.owner.username, 'TestAPI')            
        })

        it('Sould throw a 401 unauthorized', async () => {
            let password2 = new Password({
                serviceName: 'TestFail',
                password: 'TestFail',
                owner: '5ac528d73f9f953186eba98c'
            })
            let res1 = await password2.save()

            let res = await chai.request(server)
                .get('/' + password2._id + '/password')
                .set('Authorization', token)

            assert.equal(res.status, 401)
        })

        it('Sould throw a 404 not found error', async () => {
            let res = await chai.request(server)
                .get('/5ac295e62b9d5d7328fdf7aa/password')
                .set('Authorization', token)

            assert.equal(res.status, 404)
        })
    })

    describe('POST /:id/password', () => {
        let passwordToCreate = {
            serviceName: "TestCreate",
            password: "TestCreate",
        }
        
        it('Should create password', async () => {
            let res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 0)

            res = await chai.request(server)
                .post('/password')
                .set('content-type', 'application/json')
                .set('Authorization', token)                
                .send(passwordToCreate)
            assert.equal(res.status, 200)
            
            res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 1)
        })

        it('Should return an error and not create password', async () => {
            let res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 0)

            res = await chai.request(server)
                .post('/password')
                .set('content-type', 'application/json')
                .set('Authorization', token)
                .send({
                    test: "youlolnblkn"
                })
            assert.equal(res.status, 500)

            res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 0)
        })
    })

    describe('DELETE /:id/password', () => {
        let password
        beforeEach(async () => {
            password = new Password({
                serviceName: 'Test1',
                password: 'Test1',
                owner: '5ac295e62b9d5d7328fdf7ef'
            })
            let res1 = await password.save()
        })

        it('Should drop password', async () => {
            let res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 1)

            res = await chai.request(server)
                .delete('/'+ password._id +'/password')
                .set('Authorization', token)
            console.log('/' + password._id + '/password')
            console.log(res.body)
            assert.equal(res.status, 200)

            res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 0)
        })

        it('Should not drop password and return a 404 error', async () => {
            let res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 1)

            res = await chai.request(server)
                .delete('/5ac295e62b9d5d7328fdf7aa/password')
                .set('Authorization', token)
            assert.equal(res.status, 404)
            assert.equal(res.body, 'Password not found.')

            res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 1)
        })

        it('Should not drop password and return a 401 error', async () => {
            let password2 = new Password({
                serviceName: 'TestFail',
                password: 'TestFail',
                owner: '5ac528d73f9f953186eba98c'
            })
            let resCreate = await password2.save()

            let res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 1)

            res = await chai.request(server)
                .delete('/' + password2._id + '/password')
                .set('Authorization', token)
            assert.equal(res.status, 401)

            res = await chai.request(server)
                .get('/user/passwords')
                .set('Authorization', token)
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 1)
        })
    })
})
