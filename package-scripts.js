const registerSx = (sx, _ = (global.SX = {})) =>
  Object.keys(sx).forEach((key) => (global.SX[key] = sx[key]));
const sx = (name) => `node -r ./package-scripts.js -e "global.SX.${name}()"`;
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (x) => `(${x.join(') && (')})`;
// const intrim = (x) => x.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  start: `${exit0('shx mkdir logs')} && nps private.start`,
  stop: 'pm2 stop rest-api', // TODO: process name from package.json name
  dev: 'onchange "./{src,config}/**/*" -i -- nps private.dev',
  fix: `prettier --write "./src/**/*.{js,jsx,ts,scss,json}"`,
  lint: {
    default: 'nps lint.src lint.test lint.md',
    src: 'eslint ./src --ext .js --ignore-path .gitignore',
    test: 'eslint ./test --ext .js --ignore-path .gitignore',
    md: 'markdownlint *.md --config markdown.json'
  },
  test: {
    default: 'cross-env NODE_ENV=test nps lint.test private.test',
    watch: 'onchange "./test/**/*" -i -- nps private.test_watch'
  },
  validate: 'nps fix lint private.test private.validate_last',
  update: 'npm update --save/save-dev && npm outdated',
  clean: series([
    exit0('shx rm -r coverage logs'),
    exit0('shx rm -rf node_modules')
  ]),
  // Private
  private: {
    start: 'cross-env NODE_ENV=production pm2 start index.js --name rest-api',
    dev: series([
      sx('clear'),
      exit0('shx mkdir logs'),
      'concurrently "nps lint.src" "node ./index.js" -n eslint,node -c yellow,blue'
    ]),
    test: 'jest ./test/.*.test.js --runInBand',
    test_watch: `${sx('clear')} && nps test`,
    validate_last: `npm outdated || ${sx('countdown')}`
  }
});

registerSx({
  clear: () => console.log('\x1Bc'),
  countdown: (i = 8) => {
    if (!process.env.MSG) return;
    console.log('');
    const t = setInterval(() => {
      process.stdout.write('\r' + process.env.MSG + ' ' + i);
      !i-- && (clearInterval(t) || true) && console.log('\n');
    }, 1000);
  }
});
