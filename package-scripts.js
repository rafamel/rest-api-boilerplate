const path = require('path');
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (...x) => `(${x.join(') && (')})`;
const dir = (file) => path.join(CONFIG_DIR, file);
const ts = (cmd) => (TYPESCRIPT ? cmd : 'shx echo');
const dotted = (ext) => '.' + ext.replace(/,/g, ',.');
const {
  APP_NAME,
  DOCS_DIR,
  CONFIG_DIR,
  EXTENSIONS,
  TYPESCRIPT
} = require('./project.config');

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  start: series(
    exit0(`shx mkdir ${DOCS_DIR} logs`),
    `cross-env NODE_ENV=production pm2 start index.js --name ${APP_NAME}`
  ),
  stop: `pm2 stop ${APP_NAME}`,
  dev: {
    default: series(
      exit0(`shx mkdir ${DOCS_DIR} logs`),
      'onchange "./src/**/*" --initial --kill -- nps private.dev'
    ),
    db: 'nps private.dev_db'
  },
  spec: series(
    exit0(`shx mkdir ${DOCS_DIR}`),
    `jake docs:spec[${DOCS_DIR}/spec.json]`,
    `speccy lint --skip info-contact ${DOCS_DIR}/spec.json`,
    `swagger-cli validate ${DOCS_DIR}/spec.json`
  ),
  fix: [
    'prettier',
    `--write "./**/*.{${EXTENSIONS},json,scss}"`,
    `--config "${dir('.prettierrc.js')}"`,
    `--ignore-path "${dir('.prettierignore')}"`
  ].join(' '),
  lint: {
    default: [
      'concurrently',
      '"nps spec"',
      `"eslint ./src --ext ${dotted(EXTENSIONS)} -c ${dir('.eslintrc.js')}"`,
      `"${ts(`tslint ./src/**/*.{ts,tsx} -c ${dir('tslint.json')}`)}"`,
      `"${ts('tsc --noEmit')}"`,
      '-n spec,eslint,tslint,tsc',
      '-c gray,yellow,blue,magenta'
    ].join(' '),
    test: `eslint ./test --ext ${dotted(EXTENSIONS)} -c ${dir('.eslintrc.js')}`,
    md: `markdownlint *.md --config ${dir('markdown.json')}`,
    scripts: 'jake lintscripts[' + __dirname + ']'
  },
  test: {
    default: series('nps lint.test', `cross-env NODE_ENV=test jest`),
    watch: 'onchange "./test/**/*" --initial --kill -- nps private.test_watch'
  },
  validate:
    'nps lint lint.test lint.md lint.scripts test private.validate_last',
  update: 'npm update --save/save-dev && npm outdated',
  clean: series(
    exit0(`shx rm -r ${DOCS_DIR} coverage logs captain-definition`),
    'shx rm -rf node_modules'
  ),
  docs: {
    default: 'nps docs.redoc',
    redoc: series(
      'nps spec',
      `redoc-cli bundle ${DOCS_DIR}/spec.json --options.pathInMiddlePanel --options.showExtensions --options.requiredPropsFirst --options.hideHostname --options.expandResponses="200,201"`,
      `shx mv redoc-static.html ${DOCS_DIR}/index.html`
    ),
    shins: series(
      'nps spec',
      `api2html -o ${DOCS_DIR}/shins.html -l shell,javascript--nodejs ${DOCS_DIR}/spec.json`
    )
  },
  // Private
  private: {
    dev: series(
      'jake clear',
      'shx echo "____________\n"',
      'concurrently "cross-env NODE_ENV=development node ./index.js" "nps lint" -n node,+ -c green,gray'
    ),
    test_watch: series('jake clear', 'nps test'),
    validate_last: `npm outdated || jake countdown`,
    dev_db:
      'jake docker:dockerize' +
      JSON.stringify([
        `${APP_NAME}-dev-postgres`,
        'postgres:11-alpine',
        '5432:5432',
        'POSTGRES_PASSWORD:pass'
      ]),
    add: {
      docker: series(
        'docker version',
        'shx cp setup/Dockerfile ./',
        'shx cp setup/.dockerignore ./',
        `docker build --rm -f ./Dockerfile -t ${APP_NAME} ./`,
        exit0('docker rmi $(docker images -q -f dangling=true)'),
        'shx rm Dockerfile .dockerignore'
      ),
      captain: 'jake captain'
    }
  }
});
