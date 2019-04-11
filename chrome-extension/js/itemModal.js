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
        !this.modal && (this.modal = this.generateDOM());
        document.body.appendChild(this.modal);
        document.body.style.overflow = "hidden";
    };

    this.close = () => {
        this.modal && this.modal.remove();
        document.body.style.overflow = "auto";
        this.modal.searchElement.value = "";
        this.modal.searchElement.onchange();
    };

    this.generateDOM = () => {
        const createModalElement = parent => {
            const modalElement = document.createElement("div");
            modalElement.className = "modal";
            parent && parent.appendChild(modalElement);
            return modalElement;
        }

        const createModalContentElement = parent => {
            const modalContentElement = document.createElement("div");
            modalContentElement.className = "modal-content";
            parent && parent.appendChild(modalContentElement);
            return modalContentElement;
        }

        const createItemsWrapperElement = parent => {
            const itemsElement = document.createElement("div");
            itemsElement.className = "items";
            parent && parent.appendChild(itemsElement);
            return itemsElement;
        }

        const createItemElements = (items, parent) => {
            const itemElements = [];

            items.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.className = "item";
                itemElement.id = item.value;
                itemElement.value = item.value;
                itemElement.label = item.label;
                itemElement.backgroundCss = item.backgroundCss;
                itemElement.onclick = () => {
                    if (this.onItemClicked) {
                        this.onItemClicked({
                            label: item.label,
                            value: item.value,
                            backgroundCss: item.backgroundCss
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

        const createSearchElement = (elements, parent) => {
            const searchElement = document.createElement("input");
            searchElement.type = "text";

            searchElement.onchange = searchElement.onkeyup = () => {
                const query = searchElement.value.toLowerCase();
                elements.forEach(i => {
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

        const createClearElement = parent => {
            const clearElement = document.createElement("button");
            clearElement.innerText = "Clear";
            clearElement.onclick = () => {
                this.onClear && this.onClear();
            };
            parent && parent.appendChild(clearElement);
            return clearElement;
        }

        const modal = createModalElement();
        const modalContent = createModalContentElement();
        const itemsWrapper = createItemsWrapperElement();
        const itemElements = createItemElements(items);
        const searchElement = createSearchElement(itemElements);
        const clearElement = createClearElement();

        modal.appendChild(modalContent);
        modalContent.appendChild(searchElement);
        modalContent.appendChild(clearElement);
        modalContent.appendChild(itemsWrapper);
        itemElements.forEach(i => {
            itemsWrapper.appendChild(i);
        });
        
        modal.searchElement = searchElement;

        return modal;

    };
}
