import IResolver from "@/interfaces/iresolver";
import Resolver from "@/models/resolver";

/**
 *  Contains the settings for the MediatR lib
 */
class MediatrSettings {
    /**
     * The resolver instance
     * (default - Internal container)
     * @type {IResolver}
     * @memberof MediatrSettings
     */
    resolver: IResolver = new Resolver();
}

export default new MediatrSettings();
