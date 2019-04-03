function ItemModal() {
    this.generateDOM = () => {
        const modalElement = document.createElement("div");
        const itemsElement = document.createElement("div");
        items.forEach(item => {
            const wrapper = document.createElement("div");
            wrapper.id = item.value;
            wrapper.value = item.value;
            wrapper.label = item.label;
            wrapper.backgroundCss = item.backgroundCss;
            wrapper.classList.add("item");

            const image = document.createElement("div");
            image.classList.add("item-image");
            image.style.background = item.backgroundCss;

            const tooltip = document.createElement("span");
            tooltip.classList.add("item-tooltip");
            tooltip.innerText = item.label + " (" + item.value + ")";

            wrapper.appendChild(image);
            wrapper.appendChild(tooltip);
            wrapper.onclick = this.onItemClicked;
            itemsElement.appendChild(wrapper);
        });

        const queryElement = document.createElement("input");
        queryElement.type = "text";
        queryElement.onkeyup = queryElement.onchange = e => {
            const query = e.target.value.toLowerCase();
            Array.from(itemsElement.children).forEach(item => {
                if (
                    item.label.toLowerCase().includes(query) ||
                    item.value.toLowerCase().includes(query)
                ) {
                    item.style.display = "inline-block";
                } else {
                    item.style.display = "none";
                }
            });
        };

        const countElement = document.createElement("input");
        countElement.type = "number";
        countElement.min = "1";
        countElement.max = "64";

        modalElement.appendChild(queryElement);
        modalElement.appendChild(countElement);
        modalElement.appendChild(itemsElement);

        return modalElement;
    };

    this.open = slot => {
        if (slot) {
            this.slot = slot;
        }
        document.body.appendChild(this.modal);
    };

    this.close = () => {
        this.modal.remove();
    };

    this.onItemClicked = e => {
        this.slot.countElement.value = this.modal.children[1].value;
        this.slot.nameElement.value = e.currentTarget.value;
        this.slot.imageElement.style.background = e.currentTarget.backgroundCss;
        this.close();
    };

    this.modal = this.generateDOM();
}

const itemModal = new ItemModal();
const openItemModal = e => {
    itemModal.open(e.currentTarget);
};
