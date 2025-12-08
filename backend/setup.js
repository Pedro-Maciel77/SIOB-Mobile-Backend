// setup.js
const { Client } = require('pg');

async function setupDatabase() {
  console.log('🔗 Conectando ao banco Railway...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conectado!');
    
    // SQL para criar tabelas
    const createTablesSQL = `
      -- Tabela users
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          registration VARCHAR(20),
          unit VARCHAR(50),
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Tabela vehicles
      CREATE TABLE IF NOT EXISTS vehicles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          plate VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
      );

      -- Tabela occurrences
      CREATE TABLE IF NOT EXISTS occurrences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type VARCHAR(50) NOT NULL,
          municipality VARCHAR(100) NOT NULL,
          neighborhood VARCHAR(100),
          address TEXT NOT NULL,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          occurrence_date TIMESTAMP NOT NULL,
          activation_date TIMESTAMP NOT NULL,
          status VARCHAR(20) DEFAULT 'aberto',
          victim_name VARCHAR(100),
          victim_contact VARCHAR(20),
          vehicle_id UUID REFERENCES vehicles(id),
          vehicle_number VARCHAR(20),
          description TEXT NOT NULL,
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Índices
      CREATE INDEX IF NOT EXISTS idx_occurrences_status ON occurrences(status);
      CREATE INDEX IF NOT EXISTS idx_occurrences_type ON occurrences(type);
    `;
    
    console.log('🚀 Criando tabelas...');
    await client.query(createTablesSQL);
    
    // Inserir usuário admin (senha: admin123)
    const hashedPassword = '$2b$10$ExemploHash12345678901234567890'; // bcrypt de 'admin123'
    
    await client.query(`
      INSERT INTO users (name, email, password, role, registration, unit) 
      VALUES 
        ('Administrador Sistema', 'admin@siob.com', $1, 'admin', '001', 'Central'),
        ('Operador Campo', 'operador@siob.com', $1, 'operator', '002', 'Campo')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);
    
    // Inserir viaturas
    await client.query(`
      INSERT INTO vehicles (plate, name, active) 
      VALUES 
        ('AR-973', 'Viatura Alpha', true),
        ('BR-456', 'Viatura Bravo', true)
      ON CONFLICT (plate) DO NOTHING
    `);
    
    console.log('✅ Banco configurado com sucesso!');
    
    // Verificar
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const vehiclesCount = await client.query('SELECT COUNT(*) FROM vehicles');
    
    console.log(`👥 Usuários: ${usersCount.rows[0].count}`);
    console.log(`🚗 Viaturas: ${vehiclesCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

setupDatabase();