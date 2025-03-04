var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { enrichedProxies, getNextProxy } from "@/utils/enrichedProxy";
export class ProxyBalancer {
    constructor(proxies, options) {
        this.proxies = proxies;
        this.options = options;
        this.enrichedProxiesList = [];
    }
    loadProxies() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (((_a = this.proxies) === null || _a === void 0 ? void 0 : _a.length) < 1) {
                throw new Error("There are no proxies for work");
            }
            this.enrichedProxiesList = yield enrichedProxies(this.proxies, this.options);
        });
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.enrichedProxiesList.length === 0) {
                console.log("no enriched", this.enrichedProxiesList.length);
            }
            else {
                return yield getNextProxy(this.enrichedProxiesList, (_a = this.options) === null || _a === void 0 ? void 0 : _a.maxRPS);
            }
        });
    }
    getState() {
        console.table(this.enrichedProxiesList);
    }
}
