const bcrypt = require('bcrypt');

console.log('⏳ Mulai proses hashing...');

(async () => {
  try {
    const hashed = await bcrypt.hash('admin123', 10);
    console.log('\n✅ BERHASIL! Ini hasil hash password admin123:\n');
    console.log(hashed + '\n');
    process.exit();
  } catch (err) {
    console.error('❌ Gagal membuat hash:', err.message);
    process.exit(1);
  }
})();
