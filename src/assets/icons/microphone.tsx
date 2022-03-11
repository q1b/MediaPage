import { ComponentProps, createSignal, onMount } from "solid-js";
import { AnimateTo, AnimateFrom, AnimateSequence, cubicBezier } from "@microsoft/fast-animation";

export const OutlineMicrophone = (props: ComponentProps<"svg">) => {
	return (
		<svg class="w-20 h-20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<circle cx="10.75" cy="10.0027" r="9" fill="currentColor" stroke="currentColor" stroke-width="2" />
			<path
				d="M14.178 9.28443C14.178 11.288 12.5537 12.9122 10.5502 12.9122M10.5502 12.9122C8.54659 12.9122 6.92236 11.288 6.92236 9.28443M10.5502 12.9122V14.9853M10.5502 14.9853H8.47714M10.5502 14.9853H12.6232M10.5502 10.8392C9.69149 10.8392 8.99539 10.1431 8.99539 9.28443V6.17489C8.99539 5.31621 9.69149 4.62012 10.5502 4.62012C11.4088 4.62012 12.1049 5.31621 12.1049 6.17489V9.28443C12.1049 10.1431 11.4088 10.8392 10.5502 10.8392Z"
				stroke="white"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export const SolidMicrophone = (props: ComponentProps<"svg">) => {
	return (
		<svg class="w-20 h-20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<circle cx="10.75" cy="10" r="9" fill="currentColor" stroke="currentColor" stroke-width="2" />
			<path
				d="M8.85449 6.24896C8.85449 5.29443 9.62829 4.52063 10.5828 4.52063C11.5374 4.52063 12.3112 5.29443 12.3112 6.24896V9.14769C12.3112 10.1022 11.5374 10.876 10.5828 10.876C9.62829 10.876 8.85449 10.1022 8.85449 9.14769V6.24896Z"
				fill="white"
			/>
			<path
				d="M11.1589 13.1396C13.1133 12.8601 14.6156 11.1793 14.6156 9.14769C14.6156 8.82952 14.3577 8.57158 14.0395 8.57158C13.7213 8.57158 13.4634 8.82952 13.4634 9.14769C13.4634 10.7386 12.1737 12.0282 10.5828 12.0282C8.99194 12.0282 7.70227 10.7386 7.70227 9.14769C7.70227 8.82952 7.44434 8.57158 7.12616 8.57158C6.80798 8.57158 6.55005 8.82952 6.55005 9.14769C6.55005 11.1793 8.05238 12.8601 10.0067 13.1396V14.3327H8.27838C7.9602 14.3327 7.70227 14.5906 7.70227 14.9088C7.70227 15.227 7.9602 15.4849 8.27838 15.4849H12.8873C13.2054 15.4849 13.4634 15.227 13.4634 14.9088C13.4634 14.5906 13.2054 14.3327 12.8873 14.3327H11.1589V13.1396Z"
				fill="white"
			/>
		</svg>
	);
};

export const OutlinePause = (props: ComponentProps<"svg">) => {
	return (
		<svg class="w-20 h-20" viewBox="-0.375 0.375 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<circle cx="10" cy="10" r="8" fill="currentColor" stroke="currentColor" stroke-width="2" />
			<path d="M8 7 V13 M12 7 V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	);
};

export const SolidPause = (props: ComponentProps<"svg">) => {
	return (
		<svg class="w-20 h-20" viewBox="-0.375 0.375 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<circle cx="10" cy="10" r="8" fill="currentColor" stroke="currentColor" stroke-width="2" />
			<path d="M8 8 V12 M12 8 V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	);
};

export const PlayButton = () => {
	const [ishovering, setHoverState] = createSignal(false);
	const [isplaying, setPlayState] = createSignal(false);

	let playIconRef: SVGElement;
	let hoverPlayIconRef: SVGElement;
	let pauseIconRef: SVGElement;
	let hoverPauseIconRef: SVGElement;

	const makeIconHidden = (el:SVGElement) => el.classList.add("hidden");
	const makeIconVisible = (el:SVGElement) => el.classList.remove("hidden");
	
	const animateIcon = ({from,to}:{from:SVGElement,to:SVGElement}) => {
		let enteringFrom = new AnimateTo(
			// @ts-ignore
			to,
			{
				// scale: 0.5,
				opacity: 0
			},
			{
				duration: 100,
				easing: cubicBezier("easeOutSmooth"),
			}
		)
		let leaving = new AnimateTo(
			// @ts-ignore
			from,
			{
				// scale: 1,
				opacity: 1
			},
			{
				duration: 100,
				easing: cubicBezier("easeOutSmooth"),
			}
		);
		leaving.onFinish = () => {
			makeIconHidden(from);	
			makeIconVisible(to);
			enteringFrom.play();
		};
		leaving.play();
	};

	let btnRef: HTMLButtonElement;

	onMount(() => {
		btnRef.style.width = `${btnRef?.getBoundingClientRect().width}px`;
		btnRef.style.height = `${btnRef?.getBoundingClientRect().height}px`;
	});
	return (
		<button
			ref={(el: HTMLButtonElement) => (btnRef = el)}
			class="text-white relative"
			onClick={() => {
				if (isplaying() && ishovering()) {
					console.log("PAUSE ICON IS LEAVING\nAND PLAYICON IS ENTERING");
					animateIcon({
						from:hoverPauseIconRef,
						to:hoverPlayIconRef,
					})
				} else if (isplaying() && !ishovering()) {
					console.log("PAUSE ICON IS LEAVING\nAND PLAYICON IS ENTERING\n BUT NOT WITH SPACE!");
					animateIcon({
						from:hoverPlayIconRef,
						to:hoverPauseIconRef,
					})
				} else if (!isplaying() && ishovering()) {
					console.log("PLAY ICON IS LEAVING\nAND PAUSE ICON IS ENTERING");
					animateIcon({
						from:hoverPlayIconRef,
						to:hoverPauseIconRef,
					})
				} else {
					console.log("Pause ICON IS LEAVING\nAND PAUSE ICON IS ENTERING\n BUT NOT WITH SPACE!");
					animateIcon({
						from:playIconRef,
						to:pauseIconRef,
					})
				}
				setPlayState(!isplaying());
			}}
			onMouseEnter={() => {
				setHoverState(true);
				if (isplaying()) {
					animateIcon({
						from:pauseIconRef,
						to:hoverPauseIconRef
					});
				} else {
					animateIcon({
						from:playIconRef,
						to:hoverPlayIconRef
					});
				}
			}}
			onMouseLeave={() => {
				setHoverState(false);
				if (isplaying()) {
					animateIcon({
						from:hoverPauseIconRef,
						to:pauseIconRef,
					});
				} else {
					animateIcon({
						from:hoverPlayIconRef,
						to:playIconRef,
					});
				}
			}}>
			<SolidPause
				ref={(el) => {
					hoverPauseIconRef = el;
				}}
				class="fill-current text-pure-rose w-20 h-20 hidden"
				// classList={{ hidden: !(isplaying() && ishovering()) }}
			/>
			<OutlinePause
				ref={(el) => {
					pauseIconRef = el;
				}}
				class="text-pure-rose w-20 h-20 hidden"
				// classList={{ hidden: !(isplaying() && !ishovering()) }}
			/>
			<SolidMicrophone
				ref={(el) => {
					hoverPlayIconRef = el;
				}}
				class="fill-current text-pure-rose w-20 h-20 hidden"
				// classList={{ hidden: !(!isplaying() && ishovering()) }}
			/>
			<OutlineMicrophone
				ref={(el) => {
					playIconRef = el;
				}}
				class="fill-current text-pure-rose w-20 h-20"
				// classList={{ hidden: !(!isplaying() && !ishovering()) }}
			/>
		</button>
	);
};
