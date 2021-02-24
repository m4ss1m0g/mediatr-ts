import IResolver from "@/interfaces/iresolver";
import Resolver from "@/models/resolver";

class MediatrSettings {
    resolver: IResolver = new Resolver();
}

export default new MediatrSettings();
