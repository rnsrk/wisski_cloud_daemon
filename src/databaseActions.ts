// Import the Account model
import { appLogger, errorLogger } from './logging/log';
import Account, { initAccount } from './models/account';
import User, { initUser } from './models/user';
import { sequelize } from './db/connection';
import WisskiInstanceModel from './models/wisskiInstance';

/**
* Method for starting the provision.
*
* @param aid number
*
* @returns {Promise<WisskiInstanceModel|undefined>}
*/
const getWisskiInstanceData = async (aid: number): Promise <WisskiInstanceModel | undefined>=> {
  try {
    // Define your User model
    const User = initUser(sequelize);

    // Define your WisskiCloudAccountManagerAccounts model
    const Account = initAccount(sequelize);

    // Define associations
    User.hasOne(Account, { foreignKey: 'uid' });
    Account.belongsTo(User, { foreignKey: 'uid' });

    // Find the user and join account with the given aid.
    const user = await User.findOne({
      include: {
        model: Account,
        where: { aid: aid }
      }
    }) as User & { Account: Account };

    appLogger.debug('Got user from database:', user);

    if (user === null) {
      errorLogger.error('Account with aid:' + aid + ' not found.');
      return undefined;
    }

    // Create instance data object with the data from the user and account.
    const wisskiInstance: WisskiInstanceModel = {
      aid: user.Account.dataValues.aid,
      uid: user.dataValues.uid,
      status: user.dataValues.status,
      name: user.dataValues.name,
      mail: user.dataValues.mail,
      subdomain: user.Account.dataValues.subdomain,
      validation_code: user.Account.dataValues.validation_code,
      person_name: user.Account.dataValues.person_name,
      organisation: user.Account.dataValues.organisation,
      provisioned: user.Account.dataValues.provisioned
    }
    return wisskiInstance;
  } catch (error) {
    if (error instanceof Error) {
      errorLogger.error(error.message);
    }
    return undefined;
  }
}
// Export the controller methods
export {
  getWisskiInstanceData
}
