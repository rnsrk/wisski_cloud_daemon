// Route configuration for account operations

import express from 'express';
const router = express.Router();
import instanceController from './instance.controller';

/**
 * Route for provision.
 * Starts provision via websocket and set provision status.
 *
 * @param {number} aid
 * The aid of the account to provision.
 */
router.put('/provision', instanceController.proviseInstance);

/**
 * Route for delete.
 * Starts delete via websocket, sets provision status
 * and purge instance data. User and account data remain in database.
 *
 * @param {number} aid
 *  The aid of the account to delete.
 */
router.delete('/delete', instanceController.deleteInstance);

export default router;
