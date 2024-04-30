/**
 * This module exports functions to handle websocket communication with the server.
 * @packageDocumentation
 */

import {appLogger, errorLogger, websocketLogger} from "./logging/log";
import {appConfig} from "./config/appConfig";
import Call, { Remote, Hooks, WebSocketResult } from './websocket/index';
import * as calls from './websocket/calls';

/**
 * Returns the default remote for use within this app.
 * @returns The default remote object containing the websocket URL and token.
 */
export function defaultRemote(): Remote {
    return {
        'url': appConfig.websocketUrl,
        'token': appConfig.websocketToken,
    }
}

/**
 * Returns the default hooks for use within this app.
 * @returns The default hooks object containing beforeCall, afterCall, onError, and onLogLine functions.
 */
export function defaultHooks(): Partial<Hooks> {
    return {
        beforeCall: (call) => {
            websocketLogger.info('sending websocket call', call);
        },
        afterCall: (call, result) => {
            websocketLogger.info('call', call, 'got result', result.success);
        },
        onError: (call, err) => {
            errorLogger.info('call', call, 'got error', err);
        },
        onLogLine: (call, msg) => {
            appLogger.debug(msg.toString());
        }
    }
}

/**
 * Provise an instance.
 *
 * @param subdomain - The subdomain of the instance to provision.
 * @returns Promise <{success: boolean, message: string, user: string, pass:string}>
 * A promise that resolves to an object with the properties success and message.
 */
async function provisionInstance(subdomain: string): Promise<WebSocketResult> {
  return Call(
    defaultRemote(),
    calls.Provision({Slug: subdomain, Flavor: "Drupal 10", System: { "PHP": "Default (8.1)", "OpCacheDevelopment": false, "ContentSecurityPolicy": "" }}),
    defaultHooks(),
  );
}

/**
 * Purge an instance.
 *
 * @param subdomain - The subdomain of the instance to purge.
 * @returns A promise that resolves to an object with the properties success and message.
 */
async function purgeInstance(subdomain: string): Promise<{success: boolean, message: string}> {
  return Call(
    defaultRemote(),
    calls.Purge(subdomain),
    defaultHooks(),
  );
}

export {provisionInstance, purgeInstance};
