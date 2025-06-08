import { AppDataSource } from './src/database/data-source';

async function dropAllTables() {
  const dataSource = await AppDataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();

  try {
    console.log('Dropping all tables...');
    await queryRunner.query(`
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `);
    console.log('All tables dropped.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }      
}

dropAllTables();