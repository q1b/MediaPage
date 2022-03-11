import { Accessor, ComponentProps, createEffect, createRenderEffect, createSignal, onMount, Setter } from "solid-js";
// (Accessor<string> | (<U extends string>(value?: (U extends Function ? never : U) | ((prev?: string) => U)) => U))[]
function animate(el: Element, value: <T>() => [state: Accessor<T>, setState: Setter<T>]) {
	const [state, setState] = value<boolean>();
	const setHidden = () => setState(false);
	const unHidden = () => setState(true);
	createEffect(() => {
		el.animate(
			{
				scale: [1, 0],
			},
			{
				duration: 1000,
				easing: "ease-out",
			}
		);
	});
}

export const OutlinePlay = (props: ComponentProps<"svg">) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-20 w-20"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			{...props}>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
			/>
			<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	);
};

export const SolidPlay = (props: ComponentProps<"svg">) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" viewBox="0 0 20 20" fill="currentColor" {...props}>
			<path
				fill-rule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
				clip-rule="evenodd"
			/>
		</svg>
	);
};
export const OutlinePause = (props: ComponentProps<"svg">) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-20 w-20"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			{...props}>
			<path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	);
};
export const SolidPause = (props: ComponentProps<"svg">) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" viewBox="0 0 20 20" fill="currentColor" {...props}>
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
				clip-rule="evenodd"
			/>
		</svg>
	);
};

export const PlayButton = (props: ComponentProps<"button"> ) => {
	const [ishovering, setHoverState] = createSignal(false);
	const [isplaying, setPlayState] = createSignal(false);

	let playIconRef: SVGSVGElement;
	let hoverPlayIconRef: SVGSVGElement;
	let pauseIconRef: SVGSVGElement;
	let hoverPauseIconRef: SVGSVGElement;

	let btnRef: HTMLButtonElement;
	
	onMount(() => {
		btnRef.style.width = `${btnRef?.getBoundingClientRect().width}px`;
		btnRef.style.height = `${btnRef?.getBoundingClientRect().height}px`;
	});
	
	const keyFrames = {
		scaleUp: {
			scale: [0, 1],
		},
		scaleDown: {
			scale: [1, 0],
		},
	};
	
	const options: KeyframeAnimationOptions = {
		duration: 1000,
		fill: "both",
	};

	const enterAnim = (el: HTMLElement | SVGSVGElement) => {
		let a = el.animate(keyFrames.scaleUp, options);
		a.cancel();
	};

	const leaveAnim = (el: HTMLElement | SVGSVGElement) => {
		let a = el.animate(keyFrames.scaleDown, options);
		a.cancel();
	};
	
	return (
		<button
			ref={(el: HTMLButtonElement) => (btnRef = el)}
			class="text-white relative"
			onClick={() => {
				if(props.onClick){
					// @ts-ignore
					props?.onClick();
				}
				setPlayState(!isplaying());
			}}
			onMouseEnter={() => {
				setHoverState(true);
			}}
			onMouseLeave={() => {
				setHoverState(false);
			}}
			>
			<SolidPause
				ref={(el) => {
					console.log(isplaying() && ishovering());
					pauseIconRef = el;
				}}
				classList={{ hidden: !(isplaying() && ishovering()) }}
			/>
			<OutlinePause
				ref={(el) => {
					console.log(isplaying() && !ishovering());
					hoverPauseIconRef = el;
				}}
				classList={{ hidden: !(isplaying() && !ishovering()) }}
			/>
			<SolidPlay
				ref={(el) => {
					console.log(!isplaying() && ishovering());
					hoverPlayIconRef = el;
				}}
				classList={{ hidden: !(!isplaying() && ishovering()) }}
			/>
			<OutlinePlay
				ref={(el) => {
					console.log(!isplaying() && !ishovering());
					playIconRef = el;
				}}
				classList={{ hidden: !(!isplaying() && !ishovering()) }}
			/>
		</button>
	);
};
