import prompts from 'prompts';
import ensure from './ensure';

desc('Dockerize');
task('dockerize', { async: true }, async (name, image, port, ...env) => {
  ensure();
  env = env.map((item) => item.replace(':', '='));

  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Docker container: ' + name,
    choices: [
      {
        title: 'run (setup & start)',
        value:
          `docker run --name ${name}` +
          (port ? ' -p ' + port : '') +
          (env.length ? ' -e ' + env.join(',') : '') +
          ` ${image} "cd /usr/src/app && node -e 'console.log(1000)'"`
      },
      {
        title: 'start',
        value: `docker start -i ${name}`
      },
      { title: 'stop', value: `docker stop ${name}` },
      { title: 'exec (bash)', value: `docker exec -it ${name} bash` },
      { title: 'rm', value: `docker rm ${name}` },
      { title: 'exit', value: 'exit' }
    ],
    initial: 1
  });

  if (response.value === 'exit') return;
  console.log('Running: ', response.value);
  jake.exec([response.value], { interactive: true });
});
