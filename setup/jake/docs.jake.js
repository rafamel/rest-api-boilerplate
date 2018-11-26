import fs from 'fs';
import path from 'path';
import oas from '~/oas';

namespace('docs', () => {
  desc('Generate api spec');
  task('spec', (file) => {
    const docPath = path.join(__dirname, '../../', file);
    fs.writeFileSync(docPath, JSON.stringify(oas, null, 2));
  });
});
