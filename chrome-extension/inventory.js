const itemsElement = document.querySelector("#items");
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
    itemsElement.appendChild(wrapper);
});

const itemSearch = document.querySelector("#item-search");
itemSearch.onkeyup = itemSearch.onchange = e => {
    const query = e.target.value.toLowerCase();
    Array.from(itemsElement.children).forEach(item => {
        if (item.label.toLowerCase().includes(query) || item.value.toLowerCase().includes(query)) {
            item.style.display = "inline-block";
        } else {
            item.style.display = "none";
        }
    });
};

