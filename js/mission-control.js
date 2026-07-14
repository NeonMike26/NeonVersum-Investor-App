document.addEventListener("DOMContentLoaded", () => {
    const orbit = document.querySelector(".orbit-primary");

    if (!orbit) {
        return;
    }

    const orbitItems = Array.from(
        orbit.querySelectorAll(".orbit-item")
    );

    const itemAngles = [-90, 0, 90, 180];

    const descriptions = [
        "Deine persönliche Übersicht und wichtigsten Kennzahlen.",
        "Alle Investments, Beteiligungen und Holderinformationen.",
        "Verträge, Bestätigungen und persönliche Unterlagen.",
        "Neuigkeiten und exklusive Updates von NeonVersum."
    ];

    let rotation = 0;
    let velocity = 0;

    let dragging = false;
    let snapping = false;
    let targetRotation = 0;

    let previousPointerAngle = 0;
    let previousTime = performance.now();

    let descriptionElement =
        document.querySelector(".orbit-description");

    if (!descriptionElement) {
        descriptionElement = document.createElement("div");
        descriptionElement.className = "orbit-description";

        document
            .querySelector(".mission-stage")
            ?.appendChild(descriptionElement);
    }

    orbit.style.animation = "none";
    orbit.style.touchAction = "none";
    orbit.style.cursor = "grab";

    orbitItems.forEach((item) => {
        item.style.animation = "none";
    });

    const normalizeAngle = (angle) => {
        return ((angle + 180) % 360 + 360) % 360 - 180;
    };

    const getPointerAngle = (event) => {
        const bounds = orbit.getBoundingClientRect();

        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        return Math.atan2(
            event.clientY - centerY,
            event.clientX - centerX
        ) * (180 / Math.PI);
    };

    const getActiveItemIndex = () => {
        let activeIndex = 0;
        let smallestDistance = Infinity;

        itemAngles.forEach((itemAngle, index) => {
            const currentAngle = normalizeAngle(
                itemAngle + rotation
            );

            const distanceFromTop = Math.abs(
                normalizeAngle(currentAngle - (-90))
            );

            if (distanceFromTop < smallestDistance) {
                smallestDistance = distanceFromTop;
                activeIndex = index;
            }
        });

        return activeIndex;
    };

    const updateActiveItem = () => {
        const activeIndex = getActiveItemIndex();

        orbitItems.forEach((item, index) => {
            const isActive = index === activeIndex;

            item.classList.toggle("is-active", isActive);

            if (isActive) {
                item.setAttribute("aria-current", "page");
            } else {
                item.removeAttribute("aria-current");
            }
        });

        descriptionElement.innerHTML = `
            <strong>${orbitItems[activeIndex].textContent.trim()}</strong>
            <span>${descriptions[activeIndex]}</span>
        `;
    };

    const renderOrbit = () => {
        orbit.style.transform =
            `rotate(${rotation}deg)`;

        orbitItems.forEach((item) => {
            item.style.transform =
                `translate(-50%, -50%) rotate(${-rotation}deg)`;
        });

        updateActiveItem();
    };

    const calculateSnapTarget = () => {
        const activeIndex = getActiveItemIndex();

        const desiredRotation =
            -90 - itemAngles[activeIndex];

        const difference = normalizeAngle(
            desiredRotation - rotation
        );

        return rotation + difference;
    };

    orbit.addEventListener("pointerdown", (event) => {
        dragging = true;
        snapping = false;
        velocity = 0;

        previousPointerAngle = getPointerAngle(event);
        previousTime = performance.now();

        orbit.style.cursor = "grabbing";
        orbit.setPointerCapture(event.pointerId);
    });

    orbit.addEventListener("pointermove", (event) => {
        if (!dragging) {
            return;
        }

        const currentPointerAngle =
            getPointerAngle(event);

        const currentTime = performance.now();

        const angleDifference = normalizeAngle(
            currentPointerAngle - previousPointerAngle
        );

        const elapsedSeconds = Math.max(
            (currentTime - previousTime) / 1000,
            0.016
        );

        rotation += angleDifference;
        velocity = angleDifference / elapsedSeconds;

        previousPointerAngle = currentPointerAngle;
        previousTime = currentTime;

        renderOrbit();
    });

    const stopDragging = (event) => {
        if (!dragging) {
            return;
        }

        dragging = false;
        orbit.style.cursor = "grab";

        if (
            event.pointerId !== undefined &&
            orbit.hasPointerCapture(event.pointerId)
        ) {
            orbit.releasePointerCapture(event.pointerId);
        }

        rotation += velocity * 0.08;
        targetRotation = calculateSnapTarget();
        snapping = true;
    };

    orbit.addEventListener("pointerup", stopDragging);
    orbit.addEventListener("pointercancel", stopDragging);

    orbitItems.forEach((item, index) => {
        item.addEventListener("click", (event) => {
            const activeIndex = getActiveItemIndex();

            if (index !== activeIndex) {
                event.preventDefault();

                targetRotation =
                    rotation +
                    normalizeAngle(
                        -90 - itemAngles[index] - rotation
                    );

                snapping = true;
                return;
            }

            if (item.getAttribute("href") === "#") {
                event.preventDefault();

                descriptionElement.classList.add(
                    "show-message"
                );

                window.setTimeout(() => {
                    descriptionElement.classList.remove(
                        "show-message"
                    );
                }, 800);
            }
        });
    });

    const animate = () => {
        if (!dragging && snapping) {
            const difference =
                targetRotation - rotation;

            rotation += difference * 0.12;

            if (Math.abs(difference) < 0.08) {
                rotation = targetRotation;
                velocity = 0;
                snapping = false;
            }

            renderOrbit();
        }

        window.requestAnimationFrame(animate);
    };

    renderOrbit();
    window.requestAnimationFrame(animate);
});
