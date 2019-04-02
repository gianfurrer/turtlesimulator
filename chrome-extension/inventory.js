function ItemModal(slot) {

    this.init = () => {
        var modalElement = document.createElement("div");

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
        modalElement.appendChild(itemsElement);

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
        modalElement.appendChild(queryElement);
        document.querySelector("main").appendChild(modalElement);
    }

    this.onItemClicked = e => {
        slot.name.value = e.currentTarget.value;
        this.close()
    }

    this.open = () => {
        document.querySelector("main").appendChild(modalElement);
    }

    this.close = () => {
        modalElement.remove();
    }

    this.slot = slot;
    this.init();
}

const openItemModal = slot => {
    const modal = new ItemModal(slot);
}
