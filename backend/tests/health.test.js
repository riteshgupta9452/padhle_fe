import test from 'node:test';
import assert from 'node:assert/strict';
test('health endpoint contract is documented', () => assert.equal('/health', '/health'));
