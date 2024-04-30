import EventEmitter from "events";
import Account, { initAccount } from "./models/account";
import User, { initUser } from "./models/user";
import { provisionInstance } from "./websocketHandler";
import { errorLogger, websocketLogger } from "./logging/log";
import { sequelize } from "./db/connection";
import WisskiInstanceModel from "./models/wisskiInstance";
import mailer from "./mailer";

/**
 * The name of the event that is emitted when a provision request is queued.
 */
const PROVISION_EVENT = 'provision';

/**
 * A class that handles provisioning of instances.
 */
export default class Provisioner {
    private emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
        this.emitter.on(PROVISION_EVENT, async (wisskiInstance: WisskiInstanceModel) => {
            // Define your User model
            const User = initUser(sequelize);

            // Define your WisskiCloudAccountManagerAccounts model
            const Account = initAccount(sequelize);

            // Define associations
            User.hasOne(Account, { foreignKey: 'uid' });
            Account.belongsTo(User, { foreignKey: 'uid' });
            const account = await Account.findOne({
                include: {
                model: User,
                where: { uid: wisskiInstance.uid }
                }
            }) as Account & { User: User };

            if (!account) {
                errorLogger.error('account not found for account id:', wisskiInstance.name);
                return;
            }
            account.set('provisioned', 1);
            await account.save()

            try {
                const result = await this.doProvision(wisskiInstance);
                const credentials = {
                    domain: result.url,
                    user: result.username,
                    password: result.password,
                    name: account.User.dataValues.name,
                    status: result.success ? 'success' : 'error',
                    message: result.message
                }
                if (result.success) {
                    websocketLogger.info('provision succeeded for subdomain:', wisskiInstance.subdomain);
                    mailer(account.User.dataValues.mail, credentials);
                    account.set('provisioned', 2);
                    await account.save();
                } else {
                websocketLogger.error('provision failed for subdomain:', wisskiInstance.subdomain, 'error: ', result.message);
                    mailer(account.User.dataValues.mail, credentials);
                    account.set('provisioned', 3);
                    await account.save();
                }
                return result

            } catch(error) {
                websocketLogger.error('provision failed for subdomain:', wisskiInstance.subdomain);
                errorLogger.error('provision failed for subdomain:', wisskiInstance.subdomain, 'error: ', error);
                account.set('provisioned', 3);
                await account.save();
                return error;
            }
        });
    }

    /**
     * Do the actual provision.
     *
     * @param WisskiInstanceModel wisskiInstance
     *   The subdomain of the instance to provision.
     * @returns A promise that resolves to an object with the properties
     * success, message, username, and password.
     */
    async doProvision(wisskiInstance: WisskiInstanceModel) {
        websocketLogger.info("starting provision for subdomain:", wisskiInstance.subdomain)
        const status = await provisionInstance(wisskiInstance.subdomain);
        return status;
    }

    /**
     * @param {WisskiInstanceModel} wisskiInstance
     */
    queue(wisskiInstance: WisskiInstanceModel) {
      websocketLogger.info(`queueing subdomain: ${wisskiInstance.subdomain} for account: ${wisskiInstance.name}`);
      this.emitter.emit(PROVISION_EVENT, wisskiInstance);
    }
}

