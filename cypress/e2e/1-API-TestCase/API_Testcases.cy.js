/// <reference types="Cypress" />
import { faker } from '@faker-js/faker';
const service_error_schema = {
    type: 'object',
    properties: {
        "name": { type: 'string' },
        "message": { type: 'string' },
        "code": { type: 'number', minimum: 3 },
        "className": { type: 'string' },
        "data": { type: 'object' },
        "errors": { type: 'array', minItems: 1 }
    }
}
const serive_schema = {
    type: 'object',
    properties: {
        "id": { type: 'number' },
        "name": { type: 'string' },
        "updatedAt": { type: 'string' },
        "createdAt": { type: 'string' },
    }
}
const get_service_schema = {
    type: 'object',
    properties: {
        "total": { type: 'number' },
        "limit": { type: 'number' },
        "skip": { type: 'number' },
        "data": {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    "id": { type: 'number' },
                    "name": { type: 'string' },
                    "createdAt": { type: 'string' },
                    "createdAt": { type: 'string' }
                }
            }

        }
    }
}


let res_ser_name
let res_ser_id

describe("OneFootball - API Testcase - Service", () => {
    describe("Positive Flow End To End", () => {
        it("Positive Flow - Create Services - With Valid Data", () => {
            var ser_name = faker.company.bsNoun()
            var request = {
                "name": ser_name
            }
            //var url = Cypress.config('baseUrl')+'/services'
            //var method = 'POST'
            cy.api({
                'method': 'POST',
                'url': '/services',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                // cy.addContexttest("URL", url)
                // cy.addContexttest("Method", method)
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(201)
                expect(responce.body.id).not.to.be.null
                expect(responce.body.name).not.to.be.null
                res_ser_name = responce.body.name
                res_ser_id = responce.body.id
                expect(responce.body.name).equal(ser_name)
                cy.log("Serive Id:" + res_ser_id)
                cy.log("Serive Name:" + responce.body.name)
                expect(responce.body).to.be.jsonSchema(serive_schema);
            })
        })
        it("Positive - GET New Added Services using valid service Id", () => {
            var request = null
            cy.api({
                'method': 'GET',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(200)
                expect(responce.body.id).equal(res_ser_id)
                expect(responce.body.name).equal(res_ser_name)
                expect(responce.body).to.be.jsonSchema(serive_schema);
            })
        })
        it("Positive Flow - Update Services - With Valid Data", () => {
            var ser_name = faker.company.bsNoun()
            var request = {
                "name": ser_name
            }
            cy.api({
                'method': 'PATCH',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(200)
                expect(responce.body.id).not.to.be.null
                expect(responce.body.name).not.to.be.null
                res_ser_name = responce.body.name
                //res_ser_id = responce.body.id
                cy.log("Serive Id:" + res_ser_id)
                cy.log("Serive Name:" + responce.body.name)
                expect(responce.body).to.be.jsonSchema(serive_schema);
            })
        })
        it("Positive - GET New Update Services using valid service Id", () => {
            var request = null

            cy.api({
                'method': 'GET',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(200)
                expect(responce.body.id).equal(res_ser_id)
                expect(responce.body.name).equal(res_ser_name)
                expect(responce.body).to.be.jsonSchema(serive_schema);
            })
        })
        it("Positive - Delete New Services - valid service Id", () => {
            var request = null
            cy.api({
                'method': 'DELETE',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(200)
                expect(responce.body).to.be.jsonSchema(serive_schema);
            })
        })
        it("Positive - GET Services - Verify after delete service", () => {
            //res_ser_id = "Invalid"
            var request = null
            cy.api({
                'method': 'GET',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("No record found for id")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
            })
        })
    })
    describe("POST - API 'Services' Testcase", () => {
        it("Negative - Create Services - With Empty Parameter - 'name'", () => {
            var request = {
                "name": ""
            }
            cy.api({
                'method': 'POST',
                'url': '/services',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).equal("'name' should NOT be shorter than 1 characters")
                expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Create Services - Without Parameter", () => {
            var request = {

            }
            cy.api({
                'method': 'POST',
                'url': '/services',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).contains("should have required property 'name'", "Verify Error Message")
                expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Create Services - -With SpecialCharacters", () => {
            var request = {
                "name": "@#$%^&*(&!@~"
            }

            cy.api({
                'method': 'POST',
                'url': '/services',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).contains("should have required property 'name'")
                expect(responce.body).to.be.jsonSchema(service_error_schema, "Verify Schema");

            })
        })
        it("Negative - Create Services - With Invalid Data Type- integer", () => {
            var request = {
                "name": 2000
            }
            cy.api({
                'method': 'POST',
                'url': '/services',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Create Services - Page Not Found", () => {
            res_ser_id = "test"
            var request = {
                "name": 2000
            }
            cy.api({
                'method': 'POST',
                'url': '/services1',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                // cy.addContext(JSON.stringify(responce.body))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("Page not found")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
    })
    describe("PATCH - API Testcase", () => {
        it("Negative - Update Services - With Empty Parameter", () => {
            var request = {
                "name": ""
            }
            cy.api({
                'method': 'PATCH',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).equal("'name' should NOT be shorter than 1 characters")
                expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Update Services - Without Parameter", () => {
            var request = {

            }
            cy.api({
                'method': 'PATCH',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).equal("'name' should NOT be shorter than 1 characters")
                expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Update Services - With Invalid Data Type- integer", () => {
            var request = {
                "name": 2000
            }

            cy.api({
                'method': 'PATCH',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Update Services - -With SpecialCharacters", () => {
            var request = {
                "name": "@#$%^&*(&!@~"
            }

            cy.api({
                'method': 'PATCH',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(400)
                expect(responce.body.name).equal("BadRequest")
                expect(responce.body.message).equal("Invalid Parameters")
                expect(responce.body.code).equal(400)
                expect(responce.body.className).equal("bad-request")
                expect(responce.body.errors[0]).contains("should have required property 'name'")
                expect(responce.body).to.be.jsonSchema(service_error_schema, "Verify Schema");
            })
        })
        it("Negative - Update Services - With Invalid Service Id", () => {
            res_ser_id = "Invalid"
            var request = {
                "name": 2000
            }
            cy.api({
                'method': 'PATCH',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("No record found for id")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it.skip("Negative - Update Services - Without Service Id", () => {
            var ser_name = faker.company.bsNoun()
            var request = {
                "name": ser_name
            }
            cy.api({
                'method': 'PATCH',
                'url': '/services',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("No record found for id")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Update Services - Page Not Found", () => {
            res_ser_id = "test"
            var request = {
                "name": 2000
            }
            cy.api({
                'method': 'PATCH',
                'url': '/services1/' + res_ser_id,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("Page not found")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })

    })
    describe("GET - API Testcase", () => {
        it("Positive - GET All Services", () => {
            var request = null
            cy.api({
                'method': 'GET',
                'url': '/services',
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(200)
                expect(responce.body).to.be.jsonSchema(get_service_schema);

            })
        })
        it("Positive - GET All Services with limit 20", () => {
            var s_limit = 7
            var request = null
            cy.api({
                'method': 'GET',
                'url': '/services?$limit=' + s_limit,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(200)
                expect(responce.body).to.be.jsonSchema(get_service_schema)
                // var res_data = responce.body.data
                // cy.log(res_data)
                // cy.log(Object.keys(res_data).length)
                expect(Object.keys(responce.body.data).length).equal(s_limit)

            })
        })
        it("Negative - GET All Services with limit 0", () => {
            var s_limit = 0
            var request = null
            const get_service_schema_zero = {
                type: 'object',
                properties: {
                    "total": { type: 'number' },
                    "limit": { type: 'number' },
                    "skip": { type: 'number' },
                    "data": {
                        type: 'array',
                    }
                }
            }
            cy.api({
                'method': 'GET',
                'url': '/services?$limit=' + s_limit,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(200)
                expect(responce.body).to.be.jsonSchema(get_service_schema_zero)
                // var res_data = responce.body.data
                // cy.log(res_data)
                // cy.log(Object.keys(res_data).length)
                expect(Object.keys(responce.body.data).length).equal(s_limit)

            })
        })
        it("Negative - GET All Services with limit Null", () => {
            var s_limit = null
            var request = null
            cy.api({
                'method': 'GET',
                'url': '/services?$limit=' + s_limit,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(500)
                expect(responce.body.name).equal("GeneralError")
                expect(responce.body.message).equal("SQLITE_ERROR: no such column: NaN")
                expect(responce.body.code).equal(500)
                expect(responce.body.className).equal("general-error")
                //expect(responce.body.errors[0]).equal("'name' should NOT be shorter than 1 characters")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);

            })
        })
        it("Negative - GET Services with Invalid Service Id", () => {
            var res_ser_id = "invalid"
            var request = null
            cy.api({
                'method': 'GET',
                'url': '/services/' + res_ser_id,
                failOnStatusCode: false,
                body: request
            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("No record found for id")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                //expect(responce.body.errors[0]).equal("'name' should NOT be shorter than 1 characters")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);

            })
        })
        it("Negative - GET Services - Page Not Found", () => {
            var request = null
            res_ser_id = "invalid"
            cy.api({
                'method': 'GET',
                'url': '/services1/' + res_ser_id,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("Page not found")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })

    })
    describe("DELETE - Service - API Testcase", () => {
        it("Negative - Delete Services - With Invalid Service Id", () => {
            var res_ser_id1 = "Invalid"
            var request = null
            cy.api({
                'method': 'DELETE',
                'url': '/services/' + res_ser_id1,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("No record found for id")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it.skip("Negative - Delete Services - Without Service Id", () => {
            
            var request = null
            cy.api({
                'method': 'DELETE',
                'url': '/services/',
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("Page not found")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
        it("Negative - Delete Services - Page Not Found", () => {
            var res_ser_id1 = "Invalid"
            var request = null
            cy.api({
                'method': 'DELETE',
                'url': '/services1/' + res_ser_id1,
                failOnStatusCode: false,
                body: request

            }).then((responce) => {
                cy.addContexttest("Request", JSON.stringify(request, null, 2))
                cy.addContexttest("Responce", JSON.stringify(responce.body, null, 2))
                expect(responce.status).equal(404)
                expect(responce.body.name).equal("NotFound")
                expect(responce.body.message).contains("Page not found")
                expect(responce.body.code).equal(404)
                expect(responce.body.className).equal("not-found")
                // expect(responce.body.errors[0]).contains("should be string", "Verify Error Message")
                //expect(responce.body).to.be.jsonSchema(service_error_schema);
            })
        })
    })
})