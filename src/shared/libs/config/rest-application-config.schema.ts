import convict from 'convict';
import convictFormat from 'convict-format-with-validator';

import { RestApplicationConfigSchema } from './rest-application-config-schema.type.js';

convict.addFormat(convictFormat.ipaddress);

export const restApplicationConfigSchema = convict<RestApplicationConfigSchema>({
  PORT: {
    doc: 'Порт для входящих подключений',
    format: 'port',
    env: 'PORT',
    default: 3000
  },
  DB_HOST: {
    doc: 'IP-адрес сервера базы данных',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  SALT: {
    doc: 'Соль для шифрования паролей',
    format: String,
    env: 'SALT',
    default: null
  }
});
