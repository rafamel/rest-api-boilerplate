const fs = require('fs');
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (x) => `(${x.join(') && (')})`;

const appName = JSON.parse(fs.readFileSync('./package.json')).name;
process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  start: `nps private.run_common private.start`,
  stop: `pm2 stop ${appName}`,
  dev: {
    default: series([
      'nps private.run_common',
      'onchange "./src/**/*" --initial --kill -- nps private.dev'
    ]),
    db: 'nps docker.dev.db'
  },
  fix: `prettier --write "./{src,test}/**/*.{js,jsx,ts,scss,json}"`,
  lint: {
    default: 'nps lint.src lint.test lint.md lint.scripts lint.spec',
    src: 'eslint ./src --ext .js --ignore-path .gitignore',
    test: 'eslint ./test --ext .js --ignore-path .gitignore',
    md: 'markdownlint *.md --config markdown.json',
    scripts: 'jake lintscripts',
    spec: 'nps private.spec.lint'
  },
  test: {
    default: 'cross-env NODE_ENV=test nps lint.test private.test',
    watch: 'onchange "./test/**/*" --initial --kill -- nps private.test_watch'
  },
  validate: 'nps fix lint private.test private.validate_last',
  update: 'npm update --save/save-dev && npm outdated',
  clean: series([
    exit0('shx rm -r docs coverage logs captain-definition'),
    'shx rm -rf node_modules'
  ]),
  docker: {
    dev: {
      db:
        'jake docker:dockerize' +
        JSON.stringify([
          `${appName}-dev-postgres`,
          'postgres:11-alpine',
          '5432:5432',
          'POSTGRES_PASSWORD:pass'
        ])
    }
  },
  add: {
    docker: series([
      'docker version',
      'shx cp setup/Dockerfile ./',
      'shx cp setup/.dockerignore ./',
      `docker build --rm -f ./Dockerfile -t ${appName} ./`,
      exit0('docker rmi $(docker images -q -f dangling=true)'),
      'shx rm Dockerfile .dockerignore'
    ]),
    captain: 'jake captain'
  },
  docs: {
    spec: 'nps private.spec',
    shins: series([
      'nps docs.spec',
      'api2html -o docs/shins.html -l shell,javascript--nodejs docs/spec.json'
    ]),
    redoc: series([
      'nps docs.spec',
      'redoc-cli bundle docs/spec.json --options.pathInMiddlePanel --options.showExtensions --options.requiredPropsFirst --options.hideHostname --options.expandResponses="200,201"',
      'shx mv redoc-static.html docs/index.html'
    ])
  },
  // Private
  private: {
    run_common: exit0('shx mkdir docs logs'),
    start: `cross-env NODE_ENV=production pm2 start index.js --name ${appName}`,
    dev: series([
      'jake clear',
      'concurrently "nps lint.spec lint.src" "node ./index.js" -n linters,node -c yellow,blue'
    ]),
    test: 'jest ./test/.*.test.js --runInBand',
    test_watch: `jake clear && nps test`,
    validate_last: `npm outdated || jake countdown`,
    spec: {
      default: series([
        exit0('shx mkdir docs'),
        'jake docs:spec[docs/spec.json]',
        'speccy lint --skip info-contact docs/spec.json',
        'swagger-cli validate docs/spec.json'
      ]),
      lint: series([
        exit0('shx mkdir docs'),
        'jake docs:spec[docs/spec_temp.json]',
        'speccy lint --skip info-contact docs/spec_temp.json',
        'swagger-cli validate docs/spec_temp.json',
        'shx rm docs/spec_temp.json'
      ])
    }
  }
});
