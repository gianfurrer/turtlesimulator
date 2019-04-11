function ItemModal(onItemClicked, onClear) {
    this.onItemClicked = onItemClicked;
    this.onClear = onClear;

    window.addEventListener("click", e => {
        if (e.target == this.modal) {
            this.close();
        }
    });

    this.open = () => {
        if (!this.modal) {
            this.modal = this.generateDOM();
        }
        document.body.appendChild(this.modal);
        document.body.style.overflow = "hidden";
    };

    this.close = () => {
        if (this.modal) {
            this.modal.remove();
        }
        document.body.style.overflow = "auto";
        this.searchElement.value = "";
        this.searchElement.onchange();
    };

    this.generateDOM = () => {
        const modal = getModalElement();
        const modalContent = getModalContentElement();
        const itemsWrapper = getItemsWrapperElement();
        const itemElements = getItemElements(items);
        this.searchElement = getSearchElement();
        const clearElement = getClearElement();

        this.searchElement.onchange = this.searchElement.onkeyup = () => {
            const query = this.searchElement.value.toLowerCase();
            itemElements.forEach(i => {
                i.style.display =
                    i.label.toLowerCase().includes(query) ||
                    i.value.toLowerCase().includes(query)
                        ? "inline-block"
                        : "none";
            });
        };

        clearElement.onclick = () => {
            if (this.onClear) {
                this.onClear();
            }
        };

        modal.appendChild(modalContent);
        modalContent.appendChild(this.searchElement);
        modalContent.appendChild(clearElement);
        itemElements.forEach(i => {
            i.onclick = () => {
                if (this.onItemClicked) {
                    this.onItemClicked({
                        label: i.label,
                        value: i.value,
                        backgroundCss: i.backgroundCss
                    });
                }
            };
            itemsWrapper.appendChild(i);
        });
        modalContent.appendChild(itemsWrapper);

        return modal;

        function getModalElement() {
            const modalElement = document.createElement("div");
            modalElement.classList.add("modal");
            return modalElement;
        }

        function getModalContentElement() {
            const modalContentElement = document.createElement("div");
            modalContentElement.classList.add("modal-content");
            return modalContentElement;
        }

        function getItemsWrapperElement() {
            const itemsElement = document.createElement("div");
            itemsElement.classList.add("items");
            return itemsElement;
        }

        function getItemElements(items) {
            let itemElements = [];
            items.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("item");
                itemElement.id = item.value;
                itemElement.value = item.value;
                itemElement.label = item.label;
                itemElement.backgroundCss = item.backgroundCss;

                const imageElement = document.createElement("div");
                imageElement.classList.add("item-image");
                imageElement.style.background = item.backgroundCss;

                itemElement.appendChild(imageElement);
                itemElements.push(itemElement);
            });
            return itemElements;
        }

        function getSearchElement() {
            const searchElement = document.createElement("input");
            searchElement.type = "text";
            return searchElement;
        }

        function getClearElement() {
            const clearElement = document.createElement("button");
            clearElement.innerText = "Clear";
            return clearElement;
        }
    };
}
