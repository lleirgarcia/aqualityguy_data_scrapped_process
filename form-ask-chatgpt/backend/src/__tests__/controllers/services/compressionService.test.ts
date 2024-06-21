import { compressFiles } from '../../../services/compressionService';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');
  return {
    ...originalModule,
    createWriteStream: jest.fn().mockReturnValue({
      on: (event: string, handler: () => void) => {
        if (event === 'close') {
          handler();
        }
        return { on: jest.fn() };
      }
    }),
    constants: {
      F_OK: originalModule.constants.F_OK
    }
  };
});

jest.mock('archiver', () => {
  return jest.fn().mockReturnValue({
    on: jest.fn((event, handler) => {
      if (event === 'error') {
        return jest.fn();
      }
    }),
    directory: jest.fn(),
    pipe: jest.fn(),
    finalize: jest.fn(),
    pointer: jest.fn().mockReturnValue(1024),
  });
});

describe('compressFiles', () => {
  it('should create a zip file', async () => {
    const email = 'test@example.com';
    const result = await compressFiles(email);
    console.log("w")
    console.log(result)
    console.log("aaa")
    expect(result).toContain(email); // Check if the output file path contains the email
    expect(fs.createWriteStream).toHaveBeenCalled();
    // expect(archiver().finalize).toHaveBeenCalled();
  });

//   it('should handle errors', async () => {
//     archiver().on.mockImplementationOnce((event, handler) => {
//       if (event === 'error') {
//         handler(new Error('Mocked error'));
//       }
//     });
//     const email = 'error@example.com';
//     await expect(compressFiles(email)).rejects.toThrow('Mocked error');
//   });
});
