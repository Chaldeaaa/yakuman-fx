import test from 'node:test';import assert from 'node:assert/strict';import {clients,clientForUrl} from '../extension/clients.js';
test('regional scope accepts exact game entries and rejects unrelated URLs',()=>{
 for(const client of clients)assert.equal(clientForUrl(client.entry+'?paipu=example').id,client.id);
 for(const url of ['https://game.maj-soul.com/2/','https://game.mahjongsoul.com/other/','http://game.mahjongsoul.com/','https://game.mahjongsoul.com.example.com/','chrome-extension://other/','invalid'])assert.equal(clientForUrl(url),undefined);
 assert.equal(clients.find(c=>c.id==='en').cores.length,2);
});
