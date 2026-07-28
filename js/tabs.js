export function initTabs() {
    const menuTabs = document.querySelectorAll(".menu-tab");
    const menuPanels = document.querySelectorAll(".menu-panel");
    const tabStrip = document.querySelector(".menu-tabs");

    function updateScrollFade() {
        if(!tabStrip) return;
        const maxScrollLeft = tabStrip.scrollWidth - tabStrip.clientWidth;
        const canScrollLeft = tabStrip.scrollLeft > 4;
        const canScrollRight = tabStrip.scrollLeft < maxScrollLeft - 4;
        tabStrip.classList.toggle("can-scroll-left", canScrollLeft);
        tabStrip.classList.toggle("can-scroll-right", canScrollRight);
    }

    menuTabs.forEach(tab => tab.addEventListener("click", () => {
        menuTabs.forEach(t => t.classList.remove("is-active"));
        menuPanels.forEach(panel => panel.classList.remove("is-active"));

        tab.classList.add("is-active");

        menuPanels.forEach(panel => {
            if(panel.dataset.panel === tab.dataset.tab) {
                panel.classList.add("is-active");
            }
        });

        tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }));

    if (tabStrip) {
        updateScrollFade();
        tabStrip.addEventListener("scroll", updateScrollFade, { passive: true });
        window.addEventListener("resize", updateScrollFade);
    }
}