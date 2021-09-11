import {
    describe,
    test,
    expect,
    beforeAll,
    afterAll,
    beforeEach,
    jest
} from '@jest/globals'

import fs from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import FormData from 'form-data'

import Routes from '../../src/routes.js'
import TestUtil from '../_util/testUtil.js'
import { logger } from '../../src/logger.js'

describe('#Routes integration test', () => {
    let defaultDownloadsFolder = ''

    beforeAll(async () => {
        defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), 'downloads-'))
    })

    afterAll(async () => {
        await fs.promises.rm(defaultDownloadsFolder, { recursive: true })
    })

    beforeEach(() => {
        jest.spyOn(logger, 'info').mockImplementation()
    })

    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {}
    }

    describe('#getFileStatus', () => {
        test('Should upload file to the folder', async () => {
            const filename = 'demo.gif'
            const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`)
            const response = TestUtil.generateWritableStream(() => {})

            const form = new FormData()
            form.append('photo', fileStream)

            const defaultParams = {
                request: Object.assign(form, {
                    headers: form.getHeaders(),
                    method: 'POST',
                    url: '?socketId=10'
                }),

                response: Object.assign(response, {
                    setHeader: jest.fn(),
                    writeHead: jest.fn(),
                    end: jest.fn()
                }),

                values: () => Object.values(defaultParams)
            }

            const routes = new Routes(defaultDownloadsFolder)
            routes.setSocketInstance(ioObj)

            const dirBefore = await fs.promises.readdir(defaultDownloadsFolder)
            expect(dirBefore).toEqual([])
    
            await routes.handler(...defaultParams.values())

            const dirAfter = await fs.promises.readdir(defaultDownloadsFolder)
            expect(dirAfter).toEqual([filename])

            expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200)
            const expectedResult = JSON.stringify({ result: 'Files uploaded with success!'})
            expect(defaultParams.response.end).toHaveBeenCalledWith(expectedResult)
        })
    })
})