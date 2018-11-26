import fs from 'fs';
import path from 'path';

desc('Dockerfile to CaptainDuckDuck');
task('captain', () => {
  const captain = {
    schemaVersion: 1,
    dockerfileLines: fs
      .readFileSync(path.join(__dirname, 'setup/Dockerfile'))
      .toString()
      .split('\n')
      .map((x) => intrim(x).trim())
      .filter((x) => x && x[0] !== '#')
  };
  fs.writeFileSync(
    path.join(__dirname, 'captain-definition'),
    JSON.stringify(captain, null, 2)
  );
});
