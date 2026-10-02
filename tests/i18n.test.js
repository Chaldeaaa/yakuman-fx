import test from 'node:test';
import assert from 'node:assert/strict';
import {translate} from '../extension/i18n.js';

test('localized statuses preserve technical error details and English fallback',()=>{
  assert.equal(translate('Native effects loaded. Debugging disconnected.','zh-CN'),'原生特效已加载，调试连接已断开。');
  assert.equal(translate('Enable & Reload','en'),'Enable & Reload');
  assert.equal(translate('Resource substitution blocked: cache-checksum. See Extension options for details.','zh-CN'),'资源替换被阻止：cache-checksum。请在扩展设置中查看详情。');
  assert.equal(translate('Official resource download failed: 403','zh-CN'),'官方资源下载失败：403');
  assert.equal(translate('Unexpected browser error: 123','zh-CN'),'Unexpected browser error: 123');
});
