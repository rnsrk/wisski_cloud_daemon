import EventEmitter from "events";
import Account, { initAccount } from "./models/account";
import User, { initUser } from "./models/user";
import { purgeInstance } from "./websocketHandler";
import { errorLogger, websocketLogger } from "./logging/log";
import { sequelize } from "./db/connection";
import WisskiInstanceModel from "./models/wisskiInstance";

/**
 * The name of the event that is emitted when a provision request is queued.
 */
const PROVISION_EVENT = 'provision';

/**
 * A class that handles provisioning of instances.
 */
export default class Deleter {
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
            account.set('provisioned', 3);
            await account.save()

            try {
                const result = await this.doDelete(wisskiInstance);
                websocketLogger.info('Deletion succeeded for subdomain:', wisskiInstance.subdomain);
                account.set('provisioned', 0);
                await account.save();
                return result

            } catch(error) {
                websocketLogger.error('Delete failed for subdomain:', wisskiInstance.subdomain);
                errorLogger.error('Delete failed for subdomain:', wisskiInstance.subdomain, 'error: ', error);
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
     */
    async doDelete(wisskiInstance: WisskiInstanceModel) {
        websocketLogger.info("starting to delete instance " + wisskiInstance.subdomain + ".wisski.cloud.")
        const status = await purgeInstance(wisskiInstance.subdomain);
        if (status.success) {
            return ('success')
        } else {
            return status.message
        }
    }

    /**
     * @param {WisskiInstanceModel} wisskiInstance
     */
    queue(wisskiInstance: WisskiInstanceModel) {
      websocketLogger.info(`queueing subdomain: ${wisskiInstance.subdomain} for account: ${wisskiInstance.name}`);
      this.emitter.emit(PROVISION_EVENT, wisskiInstance);
    }
}

