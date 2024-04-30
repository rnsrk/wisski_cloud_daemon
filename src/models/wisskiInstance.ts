
/**
 * Interface for the wisski instance data.
 */
export default interface WisskiInstanceModel {
  aid: number; // Account id, same as in user_fields_data.
  mail: string; // User email.
  name: string; // User name.
  organisation: string|undefined; // User organisation.
  person_name: string; // Real name of the user.
  provisioned: number; // 0 = not provisioned, 1 = provisioning, 2 = provisioned, 3 = failed.
  status: number; // User status 0 = not valid, 1 = valid.
  subdomain: string; // Subdomain of the instance.
  uid: number; // User id, same as in user_fields_data.
  validation_code: string; // Validation code for the instance.
}
