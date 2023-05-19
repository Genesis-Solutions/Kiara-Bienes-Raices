const app      = require("../app")
const chai     = require("chai")
const should   = require("chai").should()
const assert   = require('chai').assert
const expect   = require('chai').expect
const chaiHttp = require("chai-http")
const path     = require("path")
const fs       = require("fs")
const sinon    = require('sinon')

const log = console.log

chai.use(chaiHttp)

let rawdataTesting = fs.readFileSync(path.resolve(__dirname, '../test-environment.json'))

let TESTING_ENVIRONMENT = JSON.parse(rawdataTesting);

describe("Server configurartion", () => {
    describe("Test Environment", () => {
        it("Correct Environment", done => {
            assert.equal(app.locals.settings.loc_env, TESTING_ENVIRONMENT.LOC_ENV, 'Environment should be')
            done()
        })
    })
})