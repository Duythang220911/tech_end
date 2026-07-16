
document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       BALANCE
    ========================= */

    const toggleBalance =
        document.getElementById("toggleBalance");

    const balanceValue =
        document.getElementById("balanceValue");

    const balanceRow =
        document.querySelector(".balance-amount-row");

    let balanceVisible = false;

    if (toggleBalance && balanceValue) {
        toggleBalance.addEventListener("click", event => {
            event.stopPropagation();

            balanceVisible = !balanceVisible;

            if (balanceVisible) {
                balanceValue.innerHTML = `
                    <span class="currency">VND</span>
                    <span class="amount">12,996</span>
                `;

                balanceValue.classList.remove(
                    "balance-hidden"
                );

                toggleBalance.innerHTML =
                    '<i class="bx bx-show"></i>';

                toggleBalance.setAttribute(
                    "aria-label",
                    "Ẩn số dư"
                );
            } else {
                balanceValue.textContent =
                    "********";

                balanceValue.classList.add(
                    "balance-hidden"
                );

                toggleBalance.innerHTML =
                    '<i class="bx bx-hide"></i>';

                toggleBalance.setAttribute(
                    "aria-label",
                    "Hiện số dư"
                );
            }
        });
    }

    /*
      Bấm vào phần số dư để chuyển sang account.html.
      Bấm icon mắt sẽ không chuyển trang.
    */
    if (balanceRow) {
        balanceRow.style.cursor = "pointer";

        balanceRow.addEventListener("click", event => {
            if (
                event.target.closest(
                    "#toggleBalance"
                )
            ) {
                return;
            }

            window.location.href =
                "./account.html";
        });
    }


    /* =========================
       TOAST
    ========================= */

    const toast =
        document.getElementById("toast");

    let toastTimer = null;

    function showToast(message) {
        if (!toast) {
            return;
        }

        clearTimeout(toastTimer);

        toast.textContent = message;
        toast.classList.add("show");

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 1500);
    }

    document
        .querySelectorAll(
            ".quick-menu-item, " +
            ".exchange-button, " +
            ".receive-button"
        )
        .forEach(button => {
            button.addEventListener("click", () => {
                showToast(
                    "Chức năng đang được mô phỏng"
                );
            });
        });


    /* =========================
       DEAL CAROUSEL
    ========================= */

    const slider =
        document.getElementById("dealSlider");

    const track =
        document.getElementById("dealTrack");

    const dots =
        document.querySelectorAll(
            "#sliderDots button"
        );

    if (slider && track) {
        const originalSlides = Array.from(
            track.querySelectorAll(
                ".deal-slide"
            )
        );

        if (originalSlides.length > 0) {
            const firstClone =
                originalSlides[0]
                    .cloneNode(true);

            const lastClone =
                originalSlides[
                    originalSlides.length - 1
                ].cloneNode(true);

            firstClone.classList.add("clone");
            lastClone.classList.add("clone");

            track.appendChild(firstClone);

            track.insertBefore(
                lastClone,
                originalSlides[0]
            );

            const slides = Array.from(
                track.querySelectorAll(
                    ".deal-slide"
                )
            );

            const slideGap = 12;
            const trackPadding = 12;

            let currentIndex = 1;
            let autoSlideTimer = null;
            let isAnimating = false;

            let touchStartX = 0;
            let touchEndX = 0;

            function getRealIndex() {
                return (
                    currentIndex -
                    1 +
                    originalSlides.length
                ) % originalSlides.length;
            }

            function updateDots() {
                const realIndex =
                    getRealIndex();

                dots.forEach(
                    (dot, index) => {
                        dot.classList.toggle(
                            "active",
                            index === realIndex
                        );
                    }
                );
            }

            function updateActiveSlide() {
                slides.forEach(
                    (slide, index) => {
                        slide.classList.toggle(
                            "is-active",
                            index === currentIndex
                        );
                    }
                );
            }

            function getTranslate(index) {
                const slideWidth =
                    slides[0].offsetWidth;

                const sliderWidth =
                    slider.offsetWidth;

                const centerOffset =
                    (
                        sliderWidth -
                        slideWidth
                    ) / 2;

                return (
                    index *
                    (
                        slideWidth +
                        slideGap
                    ) -
                    centerOffset +
                    trackPadding
                );
            }

            function moveTo(
                index,
                animate = true
            ) {
                currentIndex = index;

                track.style.transition =
                    animate
                        ? "transform 0.4s ease"
                        : "none";

                track.style.transform =
                    `translateX(-${
                        getTranslate(index)
                    }px)`;

                isAnimating = animate;

                updateDots();
                updateActiveSlide();
            }

            function nextSlide() {
                if (isAnimating) {
                    return;
                }

                moveTo(
                    currentIndex + 1
                );
            }

            function previousSlide() {
                if (isAnimating) {
                    return;
                }

                moveTo(
                    currentIndex - 1
                );
            }

            function stopAutoSlide() {
                clearInterval(
                    autoSlideTimer
                );

                autoSlideTimer = null;
            }

            function startAutoSlide() {
                stopAutoSlide();

                autoSlideTimer =
                    setInterval(() => {
                        nextSlide();
                    }, 3000);
            }

            track.addEventListener(
                "transitionend",
                () => {
                    isAnimating = false;

                    /*
                      Clone cuối bên phải
                    */
                    if (
                        currentIndex ===
                        slides.length - 1
                    ) {
                        moveTo(1, false);
                    }

                    /*
                      Clone cuối bên trái
                    */
                    if (currentIndex === 0) {
                        moveTo(
                            slides.length - 2,
                            false
                        );
                    }
                }
            );

            dots.forEach(
                (dot, index) => {
                    dot.addEventListener(
                        "click",
                        () => {
                            moveTo(
                                index + 1
                            );

                            startAutoSlide();
                        }
                    );
                }
            );

            slider.addEventListener(
                "touchstart",
                event => {
                    touchStartX =
                        event
                            .changedTouches[0]
                            .clientX;

                    stopAutoSlide();
                },
                { passive: true }
            );

            slider.addEventListener(
                "touchend",
                event => {
                    touchEndX =
                        event
                            .changedTouches[0]
                            .clientX;

                    const distance =
                        touchStartX -
                        touchEndX;

                    if (
                        Math.abs(distance) >
                        45
                    ) {
                        if (distance > 0) {
                            nextSlide();
                        } else {
                            previousSlide();
                        }
                    }

                    startAutoSlide();
                },
                { passive: true }
            );

            slider.addEventListener(
                "mouseenter",
                stopAutoSlide
            );

            slider.addEventListener(
                "mouseleave",
                startAutoSlide
            );

            window.addEventListener(
                "resize",
                () => {
                    moveTo(
                        currentIndex,
                        false
                    );
                }
            );

            moveTo(
                currentIndex,
                false
            );

            startAutoSlide();
        }
    }


    /* =========================
       SERVICE WORKER
    ========================= */

    if ("serviceWorker" in navigator) {
        window.addEventListener(
            "load",
            () => {
                navigator
                    .serviceWorker
                    .register(
                        "./service-worker.js"
                    )
                    .catch(error => {
                        console.log(
                            "Service Worker:",
                            error
                        );
                    });
            }
        );
    }
});
