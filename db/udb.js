import DB from './UnifiedDB.js';

async function example() {
  await DB.connect();

  // Query Supabase remote
  let result = await DB.table('users').where('active', true).select('id', 'name').get();
  console.log('Supabase users:', result);

  // Switch to local IndexedDB mode
  DB.switchMode('local');
  await DB.connect();

  let localUsers = await DB.table('users').where('active', true).get();
  console.log('Local users:', localUsers);

  // Backup local DB to blob
  const backupBlob = await DB.backup();
  // Save backupBlob with FileSaver or other method

  // Restore local DB from blob later
  // await DB.restore(backupBlob);
}

example();
