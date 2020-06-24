import { createConnection, Connection } from 'typeorm';
import { typeORMConfig } from '../config/typeorm';

export let db: Connection;

export let initializeDBConnection = async () => {
  try {
    db = await createConnection(typeORMConfig)
  } catch (err) {
    console.log(err)
  }
}

