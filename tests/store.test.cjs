const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { LibraryStore, validate, seed, words, cleanName, atomicWrite } = require('../electron/store.cjs');

function fixture(t) {
  const root = path.resolve(__dirname, '.tmp');
  fs.mkdirSync(root, { recursive: true });
  const base = fs.mkdtempSync(path.join(root, 'folio-store-test-'));
  t.after(() => {
    const absolute = path.resolve(base);
    const allowed = root + path.sep;
    assert.ok(absolute.startsWith(allowed), 'test cleanup remains inside the temporary directory');
    fs.rmSync(absolute, { recursive: true, force: true });
  });
  return { base, store: new LibraryStore(base) };
}
const clone = value => structuredClone(value);
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const edit = (state, text, title = state.docs[0].title) => {
  const next = clone(state);
  next.docs[0] = { ...next.docs[0], title, text, html: `<p>${text}</p>` };
  return next;
};

test('first launch creates a valid persistent library without regenerating document IDs', t => {
  const { base, store } = fixture(t);
  const first = store.load();
  assert.equal(validate(first).schema, 1);
  assert.ok(first.projects.length > 0);
  assert.ok(first.docs.length > 0);
  assert.deepEqual(new LibraryStore(base).load(), first);
  assert.ok(fs.statSync(path.join(base, 'attachments')).isDirectory());
  assert.ok(fs.statSync(path.join(base, 'history')).isDirectory());
});

test('save persists exact Unicode content and does not retain the caller input by reference', t => {
  const { base, store } = fixture(t);
  const first = store.load();
  const next = edit(first, 'Café — أفكار جميلة — 你好', 'A Unicode title');
  store.save(next);
  next.docs[0].title = 'accidental later mutation';
  const reopened = new LibraryStore(base).load();
  assert.equal(reopened.docs[0].title, 'A Unicode title');
  assert.equal(reopened.docs[0].text, 'Café — أفكار جميلة — 你好');
  assert.deepEqual(read(store.file + '.bak'), first);
  assert.equal(fs.readdirSync(base).filter(n => n.endsWith('.tmp')).length, 0);
});

test('history snapshots preserve the prior revision and throttle automatic saves', t => {
  const { store } = fixture(t);
  const original = store.load();
  const id = original.docs[0].id;
  const changed = edit(original, 'First edit', 'New title');
  store.save(changed);
  let history = store.history(id);
  assert.equal(history.length, 1);
  assert.equal(history[0].html, original.docs[0].html);
  assert.equal(history[0].title, original.docs[0].title);
  store.save(edit(store.state, 'Second edit'));
  assert.equal(store.history(id).length, 1);
  store.snapshot(store.state.docs[0]);
  history = store.history(id);
  assert.equal(history.length, 2);
  assert.equal(history[0].text, 'Second edit');
  assert.ok(history[0].id !== history[1].id);
});

test('explicit checkpoints keep the newest 60 versions', t => {
  const { store } = fixture(t);
  const state = store.load();
  for (let i = 0; i < 65; i++) store.snapshot({ ...state.docs[0], title: `Revision ${i}` });
  const history = store.history(state.docs[0].id);
  assert.equal(history.length, 60);
  assert.equal(history[0].title, 'Revision 64');
  assert.equal(history.at(-1).title, 'Revision 5');
});

test('invalid save is rejected before persistent library or backup changes', t => {
  const { store } = fixture(t);
  const original = store.load();
  const disk = fs.readFileSync(store.file, 'utf8');
  const next = clone(original);
  next.docs[0].projectId = 'nonexistent-project';
  assert.throws(() => store.save(next), /project/i);
  assert.equal(fs.readFileSync(store.file, 'utf8'), disk);
  assert.equal(fs.existsSync(store.file + '.bak'), false);
  assert.deepEqual(store.state, original);
  assert.deepEqual(store.history(original.docs[0].id), []);
});

test('damaged library recovers the last valid backup and preserves damaged bytes', t => {
  const { base, store } = fixture(t);
  store.load();
  store.save(edit(store.state, 'Saved state A', 'A'));
  const stateA = clone(store.state);
  store.save(edit(store.state, 'Saved state B', 'B'));
  const damaged = '{broken library: \u0000';
  fs.writeFileSync(store.file, damaged);
  const recoveredStore = new LibraryStore(base);
  assert.deepEqual(recoveredStore.load(), stateA);
  assert.match(recoveredStore.recovery, /Recovered/i);
  const recoveryFiles = fs.readdirSync(base).filter(n => n.startsWith('library.json.recovery-'));
  assert.equal(recoveryFiles.length, 1);
  assert.equal(fs.readFileSync(path.join(base, recoveryFiles[0]), 'utf8'), damaged);
  assert.deepEqual(read(store.file), stateA);
});

test('unrecoverable corruption is surfaced without silently replacing user files with a seed', t => {
  const { base, store } = fixture(t);
  store.load();
  fs.writeFileSync(store.file, 'damaged original');
  assert.throws(() => new LibraryStore(base).load(), /preserved/i);
  assert.equal(fs.readFileSync(store.file, 'utf8'), 'damaged original');
  fs.writeFileSync(store.file + '.bak', 'damaged backup');
  assert.throws(() => new LibraryStore(base).load());
  assert.equal(fs.readFileSync(store.file, 'utf8'), 'damaged original');
  assert.equal(fs.readFileSync(store.file + '.bak', 'utf8'), 'damaged backup');
});

test('duplicate IDs across document, project, reference and attachment namespaces are rejected', () => {
  const duplicateDoc = seed();
  duplicateDoc.docs[1].id = duplicateDoc.docs[0].id;
  assert.throws(() => validate(duplicateDoc), /duplicate/i);
  const duplicateProject = seed();
  duplicateProject.projects.push(clone(duplicateProject.projects[0]));
  assert.throws(() => validate(duplicateProject), /duplicate/i);
  const duplicateRef = seed();
  duplicateRef.refs = [{ id: duplicateRef.docs[0].id }];
  assert.throws(() => validate(duplicateRef), /duplicate/i);
  const duplicateAttachment = seed();
  duplicateAttachment.attachments = [{ id: duplicateAttachment.projects[0].id, file: 'safe', name: 'paper.pdf' }];
  assert.throws(() => validate(duplicateAttachment), /duplicate/i);
});

test('validation rejects malformed schema, dangling projects, non-text content, tags and oversized HTML', () => {
  for (const invalid of [null, {}, { schema: 2, docs: [], projects: [] }, { schema: 1, docs: {}, projects: [] }]) {
    assert.throws(() => validate(invalid), /supported/i);
  }
  const missing = seed(); missing.docs[0].projectId = 'missing';
  assert.throws(() => validate(missing), /project/i);
  const malformedTitle = seed(); malformedTitle.docs[0].title = {};
  assert.throws(() => validate(malformedTitle), /malformed/i);
  const malformedText = seed(); malformedText.docs[0].text = null;
  assert.throws(() => validate(malformedText), /malformed/i);
  const malformedTags = seed(); malformedTags.docs[0].tags = ['valid', 5];
  assert.throws(() => validate(malformedTags), /tags/i);
  const oversized = seed(); oversized.docs[0].html = 'x'.repeat(15000001);
  assert.throws(() => validate(oversized), /large/i);
});

test('IDs and attachment paths reject traversal in imported library data', t => {
  const { base, store } = fixture(t);
  const state = store.load();
  for (const id of ['../outside', '..\\outside', '/absolute', 'C:\\outside', '', 'a'.repeat(101)]) {
    const invalid = clone(state); invalid.docs[0].id = id;
    assert.throws(() => validate(invalid), /identifier/i);
    assert.throws(() => store.history(id), /Invalid document/i);
  }
  const attachment = clone(state);
  attachment.attachments = [{ id: 'attach1', name: 'Paper.pdf', file: '../outside' }];
  assert.throws(() => validate(attachment), /attachment/i);
  store.state.attachments = [{ id: 'attach1', name: 'Paper.pdf', file: 'opaque-id-123' }];
  assert.equal(store.attachmentPath('attach1'), path.join(base, 'attachments', 'opaque-id-123'));
  assert.throws(() => store.attachmentPath('missing'), /Unknown attachment/i);
  store.state.attachments[0].file = '..\\outside';
  assert.throws(() => store.attachmentPath('attach1'), /Unknown attachment/i);
});

test('new document word additions are recorded while caller-supplied activity is ignored', t => {
  const { store } = fixture(t);
  const state = store.load();
  const next = clone(state);
  next.activity = { '1900-01-01': 999999 };
  next.docs.push({ ...clone(next.docs[0]), id: 'new-note', title: 'New note', text: 'one two three', html: '<p>one two three</p>' });
  const result = store.save(next);
  assert.equal(Object.values(result.activity).reduce((sum, count) => sum + count, 0), 3);
  assert.equal(result.activity['1900-01-01'], undefined);
  const shrunk = clone(store.state);
  shrunk.docs.at(-1).text = 'one'; shrunk.docs.at(-1).html = '<p>one</p>';
  const second = store.save(shrunk);
  assert.equal(Object.values(second.activity).reduce((sum, count) => sum + count, 0), 3);
});

test('Unicode word count handles accents, Arabic, apostrophes, digits and empty input', () => {
  assert.equal(words('  Café déjà vu  '), 3);
  assert.equal(words('هذه أفكار جميلة'), 3);
  assert.equal(words("don't writer’s 123"), 3);
  assert.equal(words('hello—world\nnew\tline'), 4);
  assert.equal(words('你好 世界'), 2);
  assert.equal(words(''), 0);
  assert.equal(words(null), 0);
  assert.equal(words('... 🖊️'), 0);
});

test('export names remove Windows-invalid filename characters and honor length limits', () => {
  assert.equal(cleanName('a/b:c*?<>"|\\'), 'a-b-c-------');
  assert.equal(cleanName(' \u0000 '), '-');
  assert.equal(cleanName(' '), 'Untitled');
  assert.equal(cleanName('a'.repeat(200)).length, 120);
});

test('atomic replacement writes complete bytes and leaves no staging files', t => {
  const { base } = fixture(t);
  const filename = path.join(base, 'atomic.json');
  atomicWrite(filename, '{"value":1}');
  atomicWrite(filename, '{"value":2,"name":"é"}');
  assert.deepEqual(read(filename), { value: 2, name: 'é' });
  assert.equal(fs.readdirSync(base).filter(n => n.endsWith('.tmp')).length, 0);
});

