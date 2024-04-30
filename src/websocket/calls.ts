import type { WebSocketCall } from ".";

/** Backup backups everything */
export function Backup(): WebSocketCall {
    return {
        'call': 'backup',
        'params': [],
    }
}

type ProvisionParams = {
    Slug: string;
    Flavor?: "Drupal 10" | "Drupal 9",
    System: SystemParams
}

type SystemParams = {
    PHP: "Default (8.1)" | "8.0" | "8.1" | "8.2",
    OpCacheDevelopment: boolean,
    ContentSecurityPolicy: string,
}

/** Provision provisions a new instance */
export function Provision(params: ProvisionParams): WebSocketCall {
    return {
        'call': 'provision',
        'params': [
            JSON.stringify(params)
        ],
    }
}

/** Snapshot makes a snapshot of an instance */
export function Snapshot(subdomain: string): WebSocketCall {
    return {
        'call': 'snapshot',
        'params': [subdomain],
    }
}

/** Rebuild rebuilds an instance */
export function Rebuild(subdomain: string, params: SystemParams) {
    return {
        'call': 'rebuild',
        'params': [
            subdomain,
            JSON.stringify(params)
        ],
    }
}

/** Update updates a specific instance */
export function Update(subdomain: string): WebSocketCall {
    return {
        'call': 'update',
        'params': [subdomain],
    }
}


/** Start starts a specific instance */
export function Start(subdomain: string): WebSocketCall {
    return {
        'call': 'start',
        'params': [subdomain],
    }
}

/** Stop stops a specific instance */
export function Stop(subdomain: string): WebSocketCall {
    return {
        'call': 'stop',
        'params': [subdomain],
    }
}

/** Purge purges a specific instance */
export function Purge(subdomain: string): WebSocketCall {
    return {
        'call': 'purge',
        'params': [subdomain],
    }
}