// Import the Account model
import { getWisskiInstanceData } from '../../../databaseActions';
import Deleter from '../../../deleter';
import { appLogger, errorLogger } from '../../../logging/log';
import Provisioner from '../../../provisioner';
import { Request, Response } from "express";

// Create a new provisioner
const provisioner = new Provisioner();
const deleter = new Deleter();

/**
 * Method for starting the provision.
 *
 * @param req Request
 * @param res Response
 *
 * @returns {Promise<Response|undefined>}
 */
const proviseInstance = async (req: Request, res: Response): Promise<Response | undefined> => {
  // Get the aid from the request query.
  const { aid } = req.query;
  appLogger.debug('Got aid from request:', aid);
  // Query for instance data.
  const wisskiInstance = await getWisskiInstanceData(parseInt(aid as string));
  appLogger.debug('Got wisskiInstance from database:', wisskiInstance);
  if (wisskiInstance === undefined) {
    return res.status(404).json({
      message: 'Account not found.',
      data: {},
      success: false,
      error: null
    });
  }

  try {
    // If the instance is already provisioned, return a 200.
    if (wisskiInstance.provisioned === 2) {
      return res.status(200).json({
        message: 'Account already provisioned.',
        data: wisskiInstance,
        success: true,
        error: null
      });
    }
    // Queue the instance for provisioning.
    provisioner.queue(wisskiInstance);

    // Return a 201: provision started.
    return res.status(201).json({
      message: 'Provision started. Please wait for the confirmation mail.',
      data: wisskiInstance,
      success: true,
      error: null
    });
  }

  catch (error) {
    if (error instanceof Error) {
      errorLogger.error('provision failed for account with id:', aid, 'error:', error.message);
      return res.status(500).json({
        message: 'provision failed for account with id:' + aid,
        data: wisskiInstance,
        success: false,
        error: error.message
      });
    }
  }

};

const deleteInstance = async (req: Request, res: Response): Promise<Response | undefined> => {
  // Get the aid from the request query.
  const { aid } = req.query;

  // Query for instance data.
  const wisskiInstance = await getWisskiInstanceData(parseInt(aid as string));

  // If no instance exists, return a 200.
  if (wisskiInstance === undefined) {
    return res.status(200).json({
      message: 'Account not found.',
      data: {},
      success: false,
      error: null
    });
  }
  try {
    // If the instance is already deleted, return a 200.
    if (wisskiInstance.provisioned === 0) {
      return res.status(200).json({
        message: 'No instance to delete.',
        data: wisskiInstance,
        success: false,
        error: null
      });
    }
    // Queue the instance for deletion.
    deleter.queue(wisskiInstance);

    // Return a 201: delete started.
    return res.status(201).json({
      message: 'Delete started.',
      data: wisskiInstance,
      success: true,
      error: null
    });
  }

  catch (error) {
    if (error instanceof Error) {
      errorLogger.error('delete failed for account with id:', aid, 'error:', error.message);
      return res.status(500).json({
        message: 'delete failed for account with id:' + aid,
        data: wisskiInstance,
        success: false,
        error: error.message
      });
    }
  }

}

// Export the controller methods
export default {
  deleteInstance,
  proviseInstance
}
