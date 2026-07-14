document.addEventListener("DOMContentLoaded", () => {
    const orbit = document.querySelector(".orbit-primary");

    if (!orbit) {
        return;
    }

    const orbitItems = orbit.querySelectorAll(".orbit-item");

    let rotation = 0;
    let velocity = 6;

    let dragging = false;
    let previousPointerAngle = 0;
    let previousTime = performance.now();

    orbit.style.animation = "none";
    orbit.style.touchAction = "none";
    orbit.style.cursor = "grab";

    orbitItems.forEach((item) => {
        item.style.animation = "none";
    });

    const normalizeAngleDifference = (difference) => {
        if (difference > 180) {
            return difference - 360;
        }

        if (difference < -180) {
            return difference + 360;
        }

        return difference;
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

    const renderOrbit = () => {
        orbit.style.transform =
            `rotate(${rotation}deg)`;

        orbitItems.forEach((item) => {
            item.style.transform =
                `translate(-50%, -50%) rotate(${-rotation}deg)`;
        });
    };

    orbit.addEventListener("pointerdown", (event) => {
        dragging = true;

        previousPointerAngle = getPointerAngle(event);
        previousTime = performance.now();

        velocity = 0;

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

        const angleDifference =
            normalizeAngleDifference(
                currentPointerAngle -
                previousPointerAngle
            );

        const elapsedSeconds =
            Math.max(
                (currentTime - previousTime) / 1000,
                0.016
            );

        rotation += angleDifference;

        velocity =
            angleDifference / elapsedSeconds;

        previousPointerAngle =
            currentPointerAngle;

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
    };

    orbit.addEventListener(
        "pointerup",
        stopDragging
    );

    orbit.addEventListener(
        "pointercancel",
        stopDragging
    );

    const animate = (currentTime) => {
        const elapsedSeconds =
            Math.min(
                (currentTime - previousTime) / 1000,
                0.05
            );

        previousTime = currentTime;

        if (!dragging) {
            rotation +=
                velocity * elapsedSeconds;

            velocity *= Math.pow(
                0.985,
                elapsedSeconds * 60
            );

            if (Math.abs(velocity) < 6) {
                velocity =
                    velocity < 0 ? -6 : 6;
            }

            renderOrbit();
        }

        window.requestAnimationFrame(animate);
    };

    renderOrbit();
    window.requestAnimationFrame(animate);
});
