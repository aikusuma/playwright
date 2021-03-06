/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserContext, BrowserContextOptions } from './browserContext';
import { ConnectionTransport, SlowMoTransport } from './transport';
import * as platform from './platform';
import { assert } from './helper';

export interface Browser extends platform.EventEmitterType {
  newContext(options?: BrowserContextOptions): Promise<BrowserContext>;
  browserContexts(): BrowserContext[];
  defaultContext(): BrowserContext;

  disconnect(): Promise<void>;
  isConnected(): boolean;
  close(): Promise<void>;
}

export type ConnectOptions = {
  slowMo?: number,
  browserWSEndpoint?: string;
  transport?: ConnectionTransport;
};

export async function createTransport(options: ConnectOptions): Promise<ConnectionTransport> {
  assert(Number(!!options.browserWSEndpoint) + Number(!!options.transport) === 1, 'Exactly one of browserWSEndpoint or transport must be passed to connect');
  let transport: ConnectionTransport | undefined;
  if (options.transport)
    transport = options.transport;
  else if (options.browserWSEndpoint)
    transport = await platform.createWebSocketTransport(options.browserWSEndpoint);
  return SlowMoTransport.wrap(transport!, options.slowMo);
}
