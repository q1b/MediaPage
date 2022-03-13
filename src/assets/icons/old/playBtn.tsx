// oldend implementation
export const OutlineMicrophone = (props: ComponentProps<"svg">) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-44 w-44"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			{...props}>
			<circle cx="12" cy="12" r="12" fill="#FF0060" stroke="none" stroke-width="2"></circle>
			<g transform="scale(0.7) translate(5 5)">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
				/>
			</g>
		</svg>
	);
};

export const SolidMicrophone = (props: ComponentProps<"svg">) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" class="h-44 w-44" viewBox="0 0 24 24" fill="currentColor" {...props}>
			<circle cx="12" cy="12" r="12" fill="black" stroke="none" stroke-width="2"></circle>
			<g transform="scale(0.7) translate(7 7)">
				<path
					fill-rule="evenodd"
					d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
					clip-rule="evenodd"
				/>
			</g>
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

// const OldVersionPlayButton = () => {
// 	const [ishovering, setHoverState] = createSignal(false);
// 	const [local.state, local.setState] = createSignal(false);

// 	let playIconRef: SVGElement;
// 	let hoverPlayIconRef: SVGElement;
// 	let pauseIconRef: SVGElement;
// 	let hoverPauseIconRef: SVGElement;

// 	const makeIconHidden = (el: SVGElement) => el.classList.add("hidden");
// 	const makeIconVisible = (el: SVGElement) => el.classList.remove("hidden");

// 	const animateIcon = ({ from, to }: { from: SVGElement; to: SVGElement }) => {
// 		let enteringFrom = new AnimateFrom(
// 			// @ts-ignore
// 			to,
// 			{
// 				opacity: 0,
// 			},
// 			{
// 				duration: 300,
// 				easing: cubicBezier("easeOutSmooth"),
// 			}
// 		);
// 		let leaving = new AnimateFrom(
// 			// @ts-ignore
// 			from,
// 			{
// 				opacity: 1,
// 			},
// 			{
// 				duration: 300,
// 				easing: cubicBezier("easeOutSmooth"),
// 			}
// 		);
// 		leaving.onFinish = () => {
// 			makeIconHidden(from);
// 			makeIconVisible(to);
// 			enteringFrom.play();
// 		};
// 		leaving.play();
// 	};

// 	let btnRef: HTMLButtonElement;

// 	onMount(() => {
// 		btnRef.style.width = `${btnRef?.getBoundingClientRect().width}px`;
// 		btnRef.style.height = `${btnRef?.getBoundingClientRect().height}px`;
// 	});
// 	return (
// 		<button
// 			ref={(el: HTMLButtonElement) => (btnRef = el)}
// 			class="text-white relative"
// 			onClick={() => {
// 				if (local.state() && ishovering()) {
// 					console.log("PAUSE ICON IS LEAVING\nAND PLAYICON IS ENTERING");
// 					animateIcon({
// 						from: hoverPauseIconRef,
// 						to: hoverPlayIconRef,
// 					});
// 				} else if (local.state() && !ishovering()) {
// 					console.log("PAUSE ICON IS LEAVING\nAND PLAYICON IS ENTERING\n BUT NOT WITH SPACE!");
// 					animateIcon({
// 						from: hoverPlayIconRef,
// 						to: hoverPauseIconRef,
// 					});
// 				} else if (!local.state() && ishovering()) {
// 					console.log("PLAY ICON IS LEAVING\nAND PAUSE ICON IS ENTERING");
// 					animateIcon({
// 						from: hoverPlayIconRef,
// 						to: hoverPauseIconRef,
// 					});
// 				} else if (!local.state() && !ishovering()) {
// 					console.log("Pause ICON IS LEAVING\nAND PAUSE ICON IS ENTERING\n BUT NOT WITH SPACE!");
// 					animateIcon({
// 						from: playIconRef,
// 						to: pauseIconRef,
// 					});
// 				}
// 				local.setState(!local.state());
// 			}}
// 			onMouseEnter={() => {
// 				setHoverState(true);
// 				if (local.state()) {
// 					animateIcon({
// 						from: pauseIconRef,
// 						to: hoverPauseIconRef,
// 					});
// 				} else {
// 					animateIcon({
// 						from: playIconRef,
// 						to: hoverPlayIconRef,
// 					});
// 				}
// 			}}
// 			onMouseLeave={() => {
// 				setHoverState(false);
// 				if (local.state()) {
// 					animateIcon({
// 						from: hoverPauseIconRef,
// 						to: pauseIconRef,
// 					});
// 				} else {
// 					animateIcon({
// 						from: hoverPlayIconRef,
// 						to: playIconRef,
// 					});
// 				}
// 			}}>
// 			<SolidPause
// 				ref={(el) => {
// 					hoverPauseIconRef = el;
// 				}}
// 				class="fill-current text-pure-rose w-20 h-20 hidden"
// 				// classList={{ hidden: !(local.state() && ishovering()) }}
// 			/>
// 			<OutlinePause
// 				ref={(el) => {
// 					pauseIconRef = el;
// 				}}
// 				class="text-pure-rose w-20 h-20 hidden"
// 				// classList={{ hidden: !(local.state() && !ishovering()) }}
// 			/>
// 			<SolidMicrophone
// 				ref={(el) => {
// 					hoverPlayIconRef = el;
// 				}}
// 				class="fill-current text-pure-rose w-20 h-20 hidden"
// 				// classList={{ hidden: !(!local.state() && ishovering()) }}
// 			/>
// 			<OutlineMicrophone
// 				ref={(el) => {
// 					playIconRef = el;
// 				}}
// 				class="fill-current text-pure-rose w-20 h-20"
// 				// classList={{ hidden: !(!local.state() && !ishovering()) }}
// 			/>
// 		</button>
// 	);
// };
