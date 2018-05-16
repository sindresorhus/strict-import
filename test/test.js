import test from 'ava';
import execa from 'execa';

test('main', async t => {
	const {stderr} = await execa(process.execPath, ['test/fixture/project'], {reject: false});
	t.regex(stderr, /Cannot find module 'foo'/);
});
