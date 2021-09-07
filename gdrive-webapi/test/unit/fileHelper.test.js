import {
    describe,
    test,
    expect,
    jest
} from '@jest/globals'

import fs from 'fs'
import FileHelper from '../../src/fileHelper.js'

import Routes from '../../src/routes.js'

describe('#FileHelper', () => {
    describe('#getFileStatus', () => {
        test('it should return files statuses in correct format', async () => {

            const statMock = {
                dev: 1316845010,
                mode: 33206,    
                nlink: 1,       
                uid: 0,
                gid: 0,
                rdev: 0,
                blksize: 4096,
                ino: 562949954777739,
                size: 1195211,
                blocks: 2336,
                atimeMs: 1630971308110.3413,
                mtimeMs: 1630939595985.3093,
                ctimeMs: 1630939595985.3093,
                birthtimeMs: 1630971307169.1902,
                atime: "2021-09-06T23:35:08.110Z",
                mtime: "2021-09-06T14:46:35.985Z",
                ctime: "2021-09-06T14:46:35.985Z",
                birthtime: "2021-09-06T23:35:07.169Z"
            }

            const filename = "file.png"
            const mockUser = 'weslleyw10'
            process.env.USER = mockUser

            jest.spyOn(fs.promises, fs.promises.readdir.name)
                .mockResolvedValue([filename])

            jest.spyOn(fs.promises, fs.promises.stat.name)
                .mockResolvedValue(statMock)

            const result = await FileHelper.getFilesStatus("/tmp")

            const expectedResult = [
                {
                    size: "1.2 MB",
                    lastModified: statMock.birthtime,
                    owner: mockUser,
                    file: filename
                }
            ]

            expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
            expect(result).toMatchObject(expectedResult)


        })
    })


})