import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Vehicle } from '../entities/Vehicle';
import { Municipality } from '../entities/Municipality';
import { Occurrence } from '../entities/Occurrence';
import { Report } from '../entities/Report';
import { AuditLog } from '../entities/AuditLog';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('🔗 Conectado ao banco de dados');

    const repositories = {
      user: AppDataSource.getRepository(User),
      vehicle: AppDataSource.getRepository(Vehicle),
      municipality: AppDataSource.getRepository(Municipality),
      occurrence: AppDataSource.getRepository(Occurrence),
      report: AppDataSource.getRepository(Report),
      audit: AppDataSource.getRepository(AuditLog)
    };

    // Limpar tabelas
    console.log('🧹 Limpando tabelas...');
    await repositories.audit.clear();
    await repositories.report.clear();
    await repositories.occurrence.clear();
    await repositories.vehicle.clear();
    await repositories.municipality.clear();
    await repositories.user.clear();

    // 1. Criar municípios
    console.log('Criando municípios...');
    const municipalities = [
      { name: 'Recife', active: true },
      { name: 'Olinda', active: true },
      { name: 'Jaboatão dos Guararapes', active: true },
      { name: 'Paulista', active: true },
      { name: 'São Lourenço da Mata', active: true },
      { name: 'Moreno', active: true },
      { name: 'Cabo de Santo Agostinho', active: true },
      { name: 'Ipojuca', active: true },
      { name: 'Abreu e Lima', active: true },
      { name: 'Camaragibe', active: true }
    ];
    
    await repositories.municipality.save(municipalities);
    console.log(`✅ ${municipalities.length} municípios criados`);

    // 2. Criar usuários
    console.log('Criando usuários...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const users: Partial<User>[] = [
      {
        name: 'Administrador Sistema',
        email: 'admin@siob.com',
        password: hashedPassword,
        registration: '001',
        unit: 'Central',
        role: 'admin'
      },
      {
        name: 'Supervisor Geral',
        email: 'supervisor@siob.com',
        password: hashedPassword,
        registration: '002',
        unit: 'Coordenação',
        role: 'supervisor'
      },
      {
        name: 'Operador Campo A',
        email: 'operador1@siob.com',
        password: hashedPassword,
        registration: '003',
        unit: 'Campo Norte',
        role: 'operator'
      },
      {
        name: 'Operador Campo B',
        email: 'operador2@siob.com',
        password: hashedPassword,
        registration: '004',
        unit: 'Campo Sul',
        role: 'operator'
      },
      {
        name: 'Usuário Comum',
        email: 'usuario@siob.com',
        password: hashedPassword,
        registration: '005',
        unit: 'Administrativo',
        role: 'user'
      }
    ];

    const createdUsers = await repositories.user.save(users);
    console.log(`✅ ${createdUsers.length} usuários criados`);

    // 3. Criar viaturas
    console.log('🚗 Criando viaturas...');
    const vehicles = [
      { plate: 'AR-973', name: 'Viatura Alpha', active: true },
      { plate: 'BR-456', name: 'Viatura Bravo', active: true },
      { plate: 'CR-789', name: 'Viatura Charlie', active: true },
      { plate: 'DR-012', name: 'Viatura Delta', active: false },
      { plate: 'ER-345', name: 'Viatura Echo', active: true }
    ];

    await repositories.vehicle.save(vehicles);
    console.log(`✅ ${vehicles.length} viaturas criadas`);

    // 4. Criar ocorrências de exemplo
    console.log('🚨 Criando ocorrências...');
    const occurrences: Partial<Occurrence>[] = [
      {
        type: 'acidente',
        municipality: 'Recife',
        neighborhood: 'Boa Viagem',
        address: 'Av. Boa Viagem, 1000',
        latitude: -8.1198,
        longitude: -34.9050,
        occurrenceDate: new Date('2024-01-15T08:30:00'),
        activationDate: new Date('2024-01-15T08:35:00'),
        status: 'finalizado',
        victimName: 'João Silva',
        victimContact: '(81) 99999-9999',
        vehicleNumber: 'AR-973',
        description: 'Acidente de trânsito com vítima leve. Condutor colidiu contra poste.',
        createdBy: createdUsers[2]
      },
      {
        type: 'incendio',
        municipality: 'Olinda',
        neighborhood: 'Carmo',
        address: 'Rua do Sol, 200',
        latitude: -8.0089,
        longitude: -34.8550,
        occurrenceDate: new Date('2024-01-16T14:20:00'),
        activationDate: new Date('2024-01-16T14:25:00'),
        status: 'em_andamento',
        victimName: 'Maria Santos',
        victimContact: '(81) 98888-8888',
        vehicleNumber: 'BR-456',
        description: 'Incêndio em residência de pequeno porte. Equipe no local combatendo as chamas.',
        createdBy: createdUsers[1]
      },
      {
        type: 'resgate',
        municipality: 'Jaboatão dos Guararapes',
        neighborhood: 'Prazeres',
        address: 'Rua Nova, 300',
        latitude: -8.1127,
        longitude: -35.0147,
        occurrenceDate: new Date('2024-01-17T10:15:00'),
        activationDate: new Date('2024-01-17T10:20:00'),
        status: 'aberto',
        victimName: 'Pedro Costa',
        victimContact: '(81) 97777-7777',
        vehicleNumber: 'CR-789',
        description: 'Pessoa com mal súbito necessita de atendimento médico urgente.',
        createdBy: createdUsers[2]
      },
      {
        type: 'atropelamento',
        municipality: 'São Lourenço da Mata',
        neighborhood: 'Centro',
        address: 'Av. Principal, 400',
        latitude: -8.0039,
        longitude: -35.0390,
        occurrenceDate: new Date('2024-01-18T16:45:00'),
        activationDate: new Date('2024-01-18T16:50:00'),
        status: 'alerta',
        victimName: 'Ana Oliveira',
        victimContact: '(81) 96666-6666',
        vehicleNumber: 'AR-973',
        description: 'Atropelamento em via de grande movimento. Vítima encaminhada ao hospital.',
        createdBy: createdUsers[3]
      }
    ];

    const createdOccurrences = await repositories.occurrence.save(occurrences);
    console.log(`✅ ${createdOccurrences.length} ocorrências criadas`);

    // 5. Criar relatórios
    console.log('Criando relatórios...');
    const reports = [
      {
        content: 'Acidente atendido às 08:40. Vítima com ferimentos leves, encaminhada ao hospital. Local sinalizado e liberado às 09:15.',
        occurrence: createdOccurrences[0],
        createdBy: createdUsers[2]
      },
      {
        content: 'Incêndio controlado às 15:30. Equipe permanece no local para rescaldo. Não há vítimas. Danos materiais estimados em R$ 50.000,00.',
        occurrence: createdOccurrences[1],
        createdBy: createdUsers[1]
      }
    ];

    await repositories.report.save(reports);
    console.log(`✅ ${reports.length} relatórios criados`);

    // 6. Criar logs de auditoria
    console.log('Criando logs de auditoria...');
    const auditLogs: Partial<AuditLog>[] = [
      {
        user: createdUsers[0],
        action: 'login' as const,
        entity: 'user',
        entityId: createdUsers[0].id,
        details: { ip: '192.168.1.100' }
      },
      {
        user: createdUsers[1],
        action: 'create' as const,
        entity: 'occurrence',
        entityId: createdOccurrences[1].id,
        details: { type: 'incendio', location: 'Olinda' }
      },
      {
        user: createdUsers[2],
        action: 'update' as const,
        entity: 'occurrence',
        entityId: createdOccurrences[0].id,
        changes: { status: { from: 'aberto', to: 'finalizado' } },
        details: { reason: 'Atendimento concluído' }
      }
    ];

    await repositories.audit.save(auditLogs);
    console.log(`✅ ${auditLogs.length} logs de auditoria criados`);

    console.log('\n🎉 SEED COMPLETADO COM SUCESSO!');
    console.log('\n📊 RESUMO:');
    console.log(`🏙️  Municípios: ${municipalities.length}`);
    console.log(`👥  Usuários: ${createdUsers.length}`);
    console.log(`🚗  Viaturas: ${vehicles.length}`);
    console.log(`🚨  Ocorrências: ${createdOccurrences.length}`);
    console.log(`📝  Relatórios: ${reports.length}`);
    console.log(`📊  Logs de auditoria: ${auditLogs.length}`);

    console.log('\n🔐 CREDENCIAIS DE TESTE:');
    console.log('👑 Admin: admin@siob.com / admin123');
    console.log('👨‍💼 Supervisor: supervisor@siob.com / admin123');
    console.log('👷 Operador: operador1@siob.com / admin123');
    console.log('👤 Usuário: usuario@siob.com / admin123');

    await AppDataSource.destroy();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
}

seed();