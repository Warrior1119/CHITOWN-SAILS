'use strict';
const fs = require('fs');

describe.skip('#Upload Serice', () => {
  it('#should return uploaded file path', done => {
    UploadService.upload(fs.readFileSync('./package.json'))
      .then(() => done())
      .catch(done);
  });
});
