function ItemModal(slot) {
    this.slot = slot;
    this.modal;

    this.init = () => {
        this.modal = document.createElement("div");

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
                if (item.label.toLowerCase().includes(query) || item.value.toLowerCase().includes(query)) {
                    item.style.display = "inline-block";
                } else {
                    item.style.display = "none";
                }
            });
        };

        this.modal.appendChild(queryElement);
        this.modal.appendChild(itemsElement);
    }

    this.onItemClicked = e => {
        this.slot.nameElement.value = e.currentTarget.value;
        this.slot.imageElement.style.background = e.currentTarget.backgroundCss;
        this.close()
    }

    this.open = () => {
        document.querySelector("main").appendChild(this.modal);
    }

    this.close = () => {
        this.modal.remove()
    }

    this.init();
}

const openItemModal = e => {
    const modal = new ItemModal(e.currentTarget);
    modal.open();
}
