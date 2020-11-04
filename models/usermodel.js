export class User {
    constructor(oid, username, hashedPassword, hasInitialPassword, encryptedDecryptionKey, rights, site) {
        this.oid = oid;
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.hasInitialPassword = hasInitialPassword;
        this.encryptedDecryptionKey = encryptedDecryptionKey;
        this.rights = rights;
        this.site = site;
    }

    hasAuthorizationFor(right) {
        return this.rights && this.rights.includes(right);
    }
}
