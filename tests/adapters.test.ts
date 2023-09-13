import { suite } from 'vitest';
import assert from 'assert';
import {
  gmailSmtpTransporterAdapter,
  outlookSmtpTransporterAdapter,
  office365SmtpTransporterAdapter,
} from '../src/adapters';

const adapterSuite = suite('adapter.ts');

adapterSuite.test('gmailSmtpTransporterAdapter should have correct options', () => {
  assert.strictEqual(gmailSmtpTransporterAdapter.host, 'smtp.gmail.com');
  assert.strictEqual(gmailSmtpTransporterAdapter.service, 'gmail');
  assert.strictEqual(gmailSmtpTransporterAdapter.port, 465);
  assert.strictEqual(gmailSmtpTransporterAdapter.secure, true);
});

adapterSuite.test('outlookSmtpTransporterAdapter should have correct options', () => {
  assert.strictEqual(outlookSmtpTransporterAdapter.host, 'smtp-mail.outlook.com');
  assert.strictEqual(outlookSmtpTransporterAdapter.service, 'outlook');
  assert.strictEqual(outlookSmtpTransporterAdapter.port, 587);
  assert.strictEqual(outlookSmtpTransporterAdapter.secure, false);
  assert.deepStrictEqual(outlookSmtpTransporterAdapter.tls, {
    ciphers: 'SSLv3',
  });
});

adapterSuite.test('office365SmtpTransporterAdapter should have correct options', () => {
  assert.strictEqual(office365SmtpTransporterAdapter.host, 'smtp.office365.com');
  assert.strictEqual(office365SmtpTransporterAdapter.service, 'Outlook365');
  assert.strictEqual(office365SmtpTransporterAdapter.port, 587);
  assert.deepStrictEqual(office365SmtpTransporterAdapter.tls, {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  });
});

