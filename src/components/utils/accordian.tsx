import { on, createSignal, createEffect, Accessor } from "solid-js";
import createRAF from "@solid-primitives/raf";

export function accordian(el: HTMLElement, value: () => [Accessor<boolean>]) {
	const [isOpen] = value();
	const factor = !isOpen() ? -10 : 10;
	const [heightLimit, setHeightLimit] = createSignal(200);
	const [height, setheight] = createSignal(0);
	const [num, setNum] = createSignal(factor);
	queueMicrotask(() => {
		setHeightLimit(el.getBoundingClientRect().height);
	});
	const [running, start, stop] = createRAF(
		() =>
			setheight((count) => {
				if (count + num() <= 0 || count + num() >= heightLimit()) {
					el.style.height = `${height() + num()}px`;
					setNum(num() === factor ? -factor : factor);
					el.style.overflow = "auto";
					if (!isOpen()) {
						el.style.height = "0px";
						el.style.display = "none";
					} else {
						el.style.height = "auto";
					}
					stop();
				} else {
					el.style.height = `${height() + num()}px`;
				}
				return count + num();
			}),
		60,
		true
	);
	createEffect(
		on(isOpen, () => {
			if (!running()) start();
			el.style.overflow = "hidden";
			el.style.display = "";
		})
	);
}
