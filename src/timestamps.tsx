import { VideoPreview } from "./VideoPreview";
import { createEffect, createMemo, createSignal, mapArray, createUniqueId, on, onCleanup, onMount, For } from "solid-js";
import Split from "split.js";
import colors from "./assets/colors";

type BarDetailsOptions = {
	name: string;
	color: string;
	id?: string;
	element?: HTMLDivElement;
	timestamps: [number, number];
};

// convert percentage into currentTime of a video
const progressToSec = (prog: number, dur: number) => (dur * prog) / 100;
// convert seconds to progress
const secondsToProgress = (seconds: number, duration: number) => (seconds / duration) * 100;

// convert seconds to minutres and hours
const secToTime = (sec: number) => {
	const hours = Math.floor(sec / 3600);
	const minutes = Math.floor((sec - hours * 3600) / 60);
	const seconds = sec - hours * 3600 - minutes * 60;
	return { hours, minutes, seconds };
};

const colors_circular_iter = () => {
	let count = -1;
	return () => {
		count += 1;
		if (count >= colors.length) count = 0;
		return colors[count][1];
	};
};

const colorsIter = colors_circular_iter();
export const TimeCheck = () => {
	let videoRef:HTMLMediaElement|undefined;
	const [progress, setProgess] = createSignal<number>(0);
	const time = createMemo(() => {
		return secToTime(progressToSec(progress(), 65));
	});
	const [barDetails, setBarDetails] = createSignal<BarDetailsOptions[]>([
		{
			color: colorsIter(),
			name: "name",
			id: createUniqueId(),
			element: document.createElement("div"),
			timestamps: [0.1, 0.3],
		},
		{
			color: colorsIter(),
			name: "class",
			id: createUniqueId(),
			element: document.createElement("div"),
			timestamps: [0.4, 0.7],
		},
	]);

	const mapped = mapArray(barDetails, (barModel) => {
		const [name, setName] = createSignal(barModel.name);
		const [timestamps, setTimestamps] = createSignal(barModel.timestamps);
		return {
			id: barModel.id,
			color: barModel.color,
			element: barModel.element,
			get name() {
				return name();
			},
			get timestamps() {
				return timestamps();
			},
			setName,
			setTimestamps,
		};
	});

	const addBarItem = (details: BarDetailsOptions) => {
		const div = document.createElement("div");
		setBarDetails((barDetails) => {
			barDetails = [
				...barDetails,
				{
					id: createUniqueId(),
					element: div,
					...details,
				},
			];
			return barDetails;
		});
	};

	const removeBarItem = (id: string) => {
		setBarDetails((barDetails) => {
			const newArr = [...barDetails];
			newArr.splice(
				newArr.findIndex((i) => i.id === id),
				1
			);
			return newArr;
		});
	};

	const timestampsArr = createMemo(() => {
		let timestamps: {
			timestamp: number;
			color: string;
		}[] = [
			{
				timestamp: 0,
				color: "#FFF",
			},
		];

		for (let index = 0; index < mapped().length; index++) {
			const details: BarDetailsOptions = mapped()[index];
			if (timestamps[index])
				timestamps = [
					...timestamps,
					{
						color: details.color,
						timestamp: details.timestamps[0],
					},
					{
						color: details.color,
						timestamp: details.timestamps[1],
					},
				];
		}

		function compare(a: { timestamp: number; color: string }, b: { timestamp: number; color: string }) {
			return a.timestamp - b.timestamp;
		}

		timestamps.sort(compare);
		timestamps = [
			...timestamps,
			{
				timestamp: 1,
				color: "#FFF",
			},
		];
		console.log(timestamps);
		return timestamps;
	});

	const sizes = createMemo(() => {
		let sizes: {
			size: number;
			color: string;
		}[] = [];
		// timestamps 0 0.1 0.3 0.7 1
		// sizes 10 20 40 30
		// 10/100 , 10+20/100 , 10+20+40/100, 10+
		timestampsArr().reduce((p, v, i) => {
			sizes.push({
				size: (v.timestamp - p.timestamp) * 100,
				color: i % 2 === 0 ? v.color : "#FFF",
			});
			return v;
		});
		return sizes;
	});

	const getTimestampsFromSize = (sizes: number[]) => {
		let timestamps: number[] = [];
		sizes.reduce((t, v) => {
			timestamps.push((v + t) / 100);
			return v + t;
		}, 0);
		return timestamps;
	};

	let container: HTMLDivElement;
	onMount(() => {
		container.addEventListener("dblclick", (e) => {
			let { width, x } = container.getBoundingClientRect();
			let xPos = e.x - x;
			addBarItem({
				name: "a",
				color: colorsIter(),
				timestamps: [xPos / width - 0.05, xPos / width + 0.05],
			});
		});
	});

	createEffect(
		on(barDetails, () => {
			const elements: HTMLDivElement[] = [];
			let elementsizes: number[] = [];
			sizes().forEach((size) => {
				let i = mapped().findIndex((e) => e.color === size.color);
				const div = mapped()[i]?.element || document.createElement("div");
				div.setAttribute("contenteditable", "true");
				div.setAttribute("class", "w-full text-white h-full truncate flex items-center pl-2 focus:outline-none");
				div.style.backgroundColor = size.color;
				div.style.color = "#FFF";
				// 1. Listen for changes of the contenteditable element
				div.addEventListener("input", function (event) {
					// 2. Retrive the text from inside the element
					console.log(div.innerText, mapped()[i], mapped()[i].setName(div.innerText));
				});
				container.appendChild(div);
				elements.push(div);
				elementsizes.push(size.size);
			});
			let a = Split(elements, {
				direction: "horizontal",
				gutterSize: 10,
				sizes: elementsizes,
				snapOffset: 0,
				minSize: 0,
				onDrag: (e) => {
					let timestamps = getTimestampsFromSize(e);
					let count = 0;
					mapped().forEach((e, i) => {
						e.setTimestamps([timestamps[count], timestamps[count + 1]]);
						count += 2;
					});
				},
			});
			onCleanup(() => {
				elements.forEach((element) => {
					element.remove();
				});
				a.destroy();
			});
		})
	);
	return (
		<>
			<VideoPreview ref={videoRef} progressState={[progress, setProgess]} />
				<section class="flex max-w-4xl flex-col w-full h-full items-center">
					<h1 class="text-white text-4xl font-mono">
						{time().minutes}:{time().seconds}
					</h1>
					<input
					// width={`${container.getBoundingClientRect().width}}px`}
						type="range"
						min="0"
						max="100"
						ref={(el)=>{
							el.style.width = `896px`
						}}
						value={progress()}
						onChange={(event) => {
							// @ts-ignore It's Valid I support
							const manualChange = Number(event.target.value);
							// @ts-ignore It's already going to defined when Mount
							videoRef.currentTime = (videoRef.duration / 100) * manualChange;
							setProgess(manualChange);
						}}
					/>
					<div ref={(el) => container = el} class="flex flex-row w-full h-8"></div>
					<main class=" h-full min-h-96 flex place-content-around w-full bg-slate-900 p-10 flex-wrap">
						<For each={mapped()}>
							{(item) => (
								<div class="flex flex-col gap-4 items-center">
									<div style={{ background: item.color }} class="text-3xl w-20 h-20 rounded-xl"></div>
									<h2 class="text-slate-300 text-3xl">
										<span class="truncate w-max">{item.timestamps[0].toString().slice(0, 4)}%</span>&nbsp;to&nbsp;
										<span class="truncate w-max">{item.timestamps[1].toString().slice(0, 4)}</span>%
									</h2>
								</div>
							)}
						</For>
					</main>
				</section>
				</>
	)
} 
