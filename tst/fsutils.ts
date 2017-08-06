import * as test from 'blue-tape';
import * as proxyquire from 'proxyquire';

const EXISTS_PATH = 'exists';
const ERROR_PATH = 'error';
const ERROR = { code: 'whatever' };

const ensureDirExists = proxyquire('../src/fsutils', {
    'fs-promise': {
        mkdir(path: string) {
            switch (path) {
            case EXISTS_PATH:
                return Promise.reject({ code: 'EEXIST' });
            default:
                return Promise.resolve();
            }
        }
    }
}).ensureDirExists;

test('fsutils', (t) => {
    t.test('ensureDirExists - normal case', (st) => {
        return ensureDirExists('whatever');
    });

    t.test('ensureDirExists - already exists case', (st) => {
        return ensureDirExists(EXISTS_PATH);
    });
});
