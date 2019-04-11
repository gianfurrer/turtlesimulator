function ItemModal(onItemClicked, onClear) {
    const body = document.body;
    this.onItemClicked = onItemClicked;
    this.onClear = onClear;
    this.modal = undefined;

    window.addEventListener("click", e => {
        if (e.target == this.modal) {
            this.close();
        }
    });

    this.open = () => {
        if (!this.modal) {
            this.modal = this.generateDOM();
        }
        body.appendChild(this.modal);
        body.style.overflow = "hidden";
    };

    this.close = () => {
        if (this.modal) {
            this.modal.remove();
        }
        body.style.overflow = "auto";
        this.modal.searchElement.value = "";
        this.modal.searchElement.onchange();
    };

    this.generateDOM = () => {
        const modal = createModalElement();
        const modalContent = createModalContentElement(modal);
        const itemsWrapper = createItemsWrapperElement(modalContent);
        const itemElements = createItemElements(items, itemsWrapper);
        modal.searchElement = createSearchElement(itemElements, modalContent);
        modal.clearElement = createClearElement(modalContent);
        return dom;

        function createModalElement() {
            const modalElement = document.createElement("div");
            modalElement.className = "modal";
            return modalElement;
        }

        function createModalContentElement(parent=undefined) {
            const modalContentElement = document.createElement("div");
            modalContentElement.className = "modal-content";
            parent && parent.appendChild(modalContentElement);
            return modalContentElement;
        }

        function createItemsWrapperElement(parent=undefined) {
            const itemsElement = document.createElement("div");
            itemsElement.className = "items";
            parent && parent.appendChild(itemsElement);
            return itemsElement;
        }

        function createItemElements(items, parent=undefined) {
            const itemElements = [];

            items.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.className = "item";
                itemElement.id = item.value;
                itemElement.value = item.value;
                itemElement.label = item.label;
                itemElement.backgroundCss = item.backgroundCss;
                itemElement.onclick = e => {
                    if (this.onItemClicked) {
                        this.onItemClicked({
                            label: e.currentTarget.label,
                            value: e.currentTarget.value,
                            backgroundCss: e.currentTarget.backgroundCss
                        });
                    }
                };
                parent && parent.appendChild(itemElement);

                const imageElement = document.createElement("div");
                imageElement.className = "item-image";
                imageElement.style.background = item.backgroundCss;
                itemElement.appendChild(imageElement);

                itemElements.push(itemElement);
            });
            return itemElements;
        }

        function createSearchElement(searchArray, parent=undefined) {
            const searchElement = document.createElement("input");
            searchElement.type = "text";

            searchElement.onchange = searchElement.onkeyup = () => {
                const query = searchElement.value.toLowerCase();
                searchArray.forEach(i => {
                    i.style.display =
                        i.label.toLowerCase().includes(query) ||
                        i.value.toLowerCase().includes(query)
                            ? "inline-block"
                            : "none";
                });
            };

            parent && parent.appendChild(searchElement);

            return searchElement;
        }

        function createClearElement(parent=undefined) {
            const clearElement = document.createElement("button");
            clearElement.innerText = "Clear";
            clearElement.onclick = () => {
                this.onClear && this.onClear();
            };
            parent && parent.appendChild(clearElement);
            return clearElement;
        }
    };
}
