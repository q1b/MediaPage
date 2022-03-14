import { insert } from "solid-js/web";
import { createSignal, onCleanup, JSX, sharedConfig } from "solid-js";

export function InsertBeforeApp(props: { children: JSX.Element }) {	
	const marker = document.createTextNode("")
	const mount = document.body;
	// don't render when hydrating
	function renderPortal() {
		if (sharedConfig.context) {
			const [s, set] = createSignal(false);
			queueMicrotask(() => set(true));
			return () => s() && props.children;
		} else return () => props.children;
	}
		const container = document.createElement("div");
		Object.defineProperty(container, "host", {
			get() {
				return marker.parentNode;
			},
		});
		insert(container, renderPortal());
		mount.before(container);
		(props as any).ref && (props as any).ref(container);
		onCleanup(() => document.documentElement.removeChild(container));
	return marker;
}
