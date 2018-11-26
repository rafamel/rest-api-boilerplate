import hasbin from 'hasbin';

export default function ensure() {
  if (hasbin.sync('docker')) return;

  console.error(
    'Docker binary is not available in path.\n' +
      'Install docker at https://www.docker.com/get-started ' +
      'and run afterwards.\n'
  );
  throw Error('docker not available');
}
