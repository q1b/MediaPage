import { VideoPreview } from "./VideoPreview";
import { createEffect, createMemo, createSignal, mapArray, createUniqueId, on, onCleanup, onMount, createRenderEffect } from "solid-js";
import { PlayButton } from "./assets/icons/microphone";
import FileUpload from "./components/FileUpload";
import { RecordView } from "./RecordView";
import type { Component } from "solid-js";
import { RecordAudio } from "./RecordAudio";
import Split from "split.js";



type BarDetailsOptions = {
	name: string;
	color: string;
	id?: string;
	timestamps: [number, number];
};

/* API Design for timestamps
	Thinking process, 🤔
 */

const App: Component = () => {
	const mimeType = "audio/webm";
	const [barDetails, setBarDetails] = createSignal<BarDetailsOptions[]>([
		{
			color: "#FFA",
			name: "name",
			id: createUniqueId(),
			timestamps: [0.1, 0.3],
		},
		{
			color: "#0AF",
			name: "class",
			id: createUniqueId(),
			timestamps: [0.4, 0.7],
		},
	]);

	const mapped = mapArray(barDetails, (barModel) => {
		const [name, setName] = createSignal(barModel.name);
		const [timestamps, setTimestamps] = createSignal(barModel.timestamps);
		return {
			id: barModel.id,
			color: barModel.color,
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
		setBarDetails((barDetails) => {
			barDetails = [
				...barDetails,
				{
					id: createUniqueId(),
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

	// setTimeout(() => {
	// 	addBarItem({
	// 		color: "#F0F",
	// 		name: "school",
	// 		id: "Happy",
	// 		timestamps: [0.75, 0.9],
	// 	});
	// }, 4000);

	// setTimeout(() => {
	// 	removeBarItem("Happy");
	// }, 6000);

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
		for (let index = 0; index < barDetails().length; index++) {
			const details: BarDetailsOptions = barDetails()[index];
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
		timestamps = [
			...timestamps,
			{
				timestamp: 1,
				color: "#FFF",
			},
		];
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
			let {width,x} = container.getBoundingClientRect();
			let xPos = e.x-x;
			// console.log(xPos / width);
			addBarItem(
				{
					name:"a",
					color:"#0FF",
					timestamps:[(xPos/width)-0.05,(xPos/width)+0.05],
				}
			)
		});
	});
	createEffect(
		on(barDetails, () => {
			const elements: HTMLDivElement[] = [];
			let elementsizes: number[] = [];
			sizes().forEach((size) => {
				const div = document.createElement("div");
				let i = mapped().findIndex((e) => e.color === size.color);
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
		<div class="w-full min-h-screen bg-slate-900 flex flex-col">
			<section class="w-full h-full flex flex-col items-center gap-y-48">
				<VideoPreview />
				<section class="flex max-w-4xl flex-col w-full h-full items-center">
					<div
						ref={(el) => {
							container = el;
						}}
						class="flex flex-row w-full h-8"></div>
					<main class="h-96 flex place-content-around w-full bg-slate-900 p-10">
						<div class="flex flex-col gap-2">
							<h1 class="text-yellow-300 text-3xl">Yellow Reason</h1>
							<h2 class="text-slate-300 text-3xl">
								<span class="truncate w-max">{mapped()[0].timestamps[0].toString().slice(0,6)} %</span>
								to
								<span class="truncate w-max">{mapped()[0].timestamps[1].toString().slice(0,6)}</span> %
							</h2>
						</div>
						<div class="flex flex-col gap-2">
							<h1 class="text-blue-500 text-3xl">Blue Reason</h1>
							<h2 class="text-slate-300 text-3xl">
								<span class="truncate w-max">{mapped()[1].timestamps[0].toString().slice(0,6)} %</span>
								to
								<span class="truncate w-max">{mapped()[1].timestamps[1].toString().slice(0,6)}</span> %
							</h2>
						</div>
					</main>
				</section>
				{/* <RecordView /> */}
				{/* <RecordAudio /> */}
			</section>
		</div>
	);
};

export default App;

{
	/* <button ref={(el) => (recordRef = el)} onClick={() => {
          console.log("RECORD");
          record();
        }} class="bg-white text-black">
					RECORD
				</button>
				<button ref={(el) => (stopRef = el)} onClick={() => {
          console.log("STOP");
          stop();
        }} class="">
					STOP
				</button> */
}
{
	/* <div ref={(el) => (soundClips = el)} onClick={stop} ></div> */
}
