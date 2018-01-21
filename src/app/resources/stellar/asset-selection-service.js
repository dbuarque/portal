
export class AssetSelectionService {
    select(asset) {
        return this.customElement.open(asset);
    }

    _registerCustomElement(customElement) {
        this.customElement = customElement;
    }
}
