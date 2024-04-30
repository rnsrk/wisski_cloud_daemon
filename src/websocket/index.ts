/** @file implements the websocket protocol used by the distillery */

import WebSocket from "ws";
import { errorLogger} from "../logging/log";

/** A call to the websocket endpoint */
export interface WebSocketCall {
  call: string;
  params: string[];
}

/** the result of a websocket call */
export interface WebSocketResult {
  message: string,
  password: string,
  success: boolean,
  username: string,
  url: string,
}

/** optional hooks to call when something happens */
export interface Hooks {
  beforeCall: (call: WebSocketCall) => void;   // called right before sending the request
  afterCall: (call: WebSocketCall, result: WebSocketResult) => void;   // called when the socket is closed
  onError: (call: WebSocketCall, error: any) => void;   // called when an error occurs before rejecting the promise
  onLogLine: (call: WebSocketCall, line: string) => void;   // called when a log line is received
}

/** specifies a remote endpoint */
export interface Remote {
  url: string; // the remote websocket url to talk to
  token?: string; // optional token
}

/**
 * Run a websocket remote call
 *
 * @param remote the remote to call
 * @param call the call to make
 * @param hooks optional hooks to call when something happens
 *
 * @returns a promise that resolves to the result of the call
 */
export default async function Call(remote: Remote, call: WebSocketCall, hooks?: Partial<Hooks>): Promise<WebSocketResult> {
  return new Promise((resolve, reject) => {
    let options = { headers: {} };
    if (remote.token) {
      options.headers = { 'Authorization': 'Bearer ' + remote.token };
    }
    const ws = new WebSocket(remote.url, options);

    let result = {'success': false, 'message': 'Unknown error'};
    let username = '';
    let password = '';
    let url = '';
    ws.on('error', (err) => {
      if (hooks && hooks.onError) {
        hooks.onError(call, err);
      }
      reject(err)
    });
    ws.on('open', () => {
      if (hooks && hooks.beforeCall) {
        hooks.beforeCall(call);
      }
      ws.send(Buffer.from(JSON.stringify(call), 'utf8'));
    });

    ws.on('message', async (msg, isBinary) => {
      if (!isBinary) {
        if (hooks && hooks.onLogLine) {
          hooks.onLogLine(call, msg.toString());
          try {
          if (msg.toString().includes('URL')) {
            url = msg.toString().split(': ')[1].trim();
          }
          if (msg.toString().includes('Username')) {
            username = msg.toString().split(': ')[1].trim();
          }
          if (msg.toString().includes('Password')) {
            password = msg.toString().split(': ')[1].trim();
          }
        } catch (e) {
          errorLogger.error('error parsing log line', e);
          return;
        }
        }
        return;
      }
      result = JSON.parse(msg.toString());
    });
    // @todo add username and pass only if provided.
    ws.on('close', () => {
      if (hooks && hooks.afterCall) {
        hooks.afterCall(call, {...result, password, url, username});
      }
      resolve({
        ...result,
        password,
        url,
        username
      });
    });
  });
}