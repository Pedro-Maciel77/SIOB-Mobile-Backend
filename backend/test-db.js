const { Client } = require('pg');

async function setup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('‚úÖ Conectado ao Railway!');
    
    // Criar tabela teste
    await client.query(`
      CREATE TABLE IF NOT EXISTS teste_siob (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Inserir dado
    await client.query(`
      INSERT INTO teste_siob (nome) 
      VALUES ('SIOB Mobile Online')
    `);
    
    // Verificar
    const result = await client.query('SELECT * FROM teste_siob');
    console.log('Ì≥ã Resultado:', result.rows);
    
  } catch (err) {
    console.error('‚ùå Erro:', err.message);
  } finally {
    await client.end();
  }
}

setup();
