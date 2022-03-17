import { Component, createEffect, createReaction, createSignal, Match, on, onMount, Show, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import { PlayButton } from "./assets/icons/microphone";
import { useReactMediaRecorder, StatusMessages } from "./mediaRecorder";
import { StopBtn } from "./assets/icons/stop";
import { TickBtn, } from "./assets/icons/tick";
import { XBtn } from "./assets/icons/x";

const VideoRecorder: Component = () => {
	const [videoModel, setVideoModel] = createSignal(false);
	const [mediaBlobURL,setMediaBlobURL] = createSignal<string>();
	const closeVideoModel = () => setVideoModel(false);
	const openVideoModel = () => setVideoModel(true);
	createEffect( on(mediaBlobURL,(v,p)=>{
		if (typeof p === 'string' )
			URL.revokeObjectURL(p);
		console.log(p);
		return mediaBlobURL();
	}))
	return (
		<div class="w-full min-h-screen bg-slate-900 flex items-center justify-center">
			<Show when={mediaBlobURL()} >
				<video class="w-auto h-full rounded-xl" src={mediaBlobURL()} controls autoplay loop ></video>
			</Show>
			<button
				onClick={openVideoModel}
				class="text-sky-500 bg-white hover:text-sky-50 hover:bg-sky-500 w-max h-max p-6 rounded-2xl hover:scale-105 active:scale-110 transition-[colors,transform]">
				<span class="leading-6 text-4xl">Create video</span>
			</button>
			<Show when={videoModel()}>
				<Portal>
					<RecorderDialog closeEvent={closeVideoModel} setBlobURL={setMediaBlobURL} />
				</Portal>
			</Show>
		</div>
	);
};

export const RecorderDialog = (props: { closeEvent: any, setBlobURL: any }) => {
	let previewRef: HTMLVideoElement;
	const [isRecording, setRecording] = createSignal(false);
	const [isStopped, setStopped] = createSignal(false);
	const track = createReaction(() => {
		let stream = new MediaStream(mediaStream()?.getVideoTracks());
		if (previewRef && stream) previewRef.srcObject = stream;
	});
	const { status, startRecording, stopRecording, resumeRecording, pauseRecording, clearBlobUrl, mediaBlobUrl, mediaStream } =
		useReactMediaRecorder({
			video: true,
		});
	track(() => mediaStream());
	createEffect(() => {
		switch (status()) {
			case "recording":
				setRecording(true);
				break;
			case "idle":
				track(() => mediaStream());
				break;
			default:
				setRecording(false);
				break;
		}
	});
	let overlayRef: HTMLDivElement;
	let panelRef: HTMLDivElement;
	let statusRef: HTMLDivElement;
	let videoContainerRef: HTMLElement;
	let bottomControllerRef: HTMLDivElement;

	onMount(() => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 300,
				fill: "both",
				easing:'cubic-bezier(.90, 0, 1, 1)'
			}
		);
		overlayAnimation.onfinish = () => {
			overlayAnimation.commitStyles();
			overlayAnimation.cancel();
		};
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 400,
				fill: "both",
				easing:'cubic-bezier(.70, 0, 1, 1)'
			}
		);
		panelAnimation.onfinish = () => {
			panelAnimation.commitStyles();
			panelAnimation.cancel();
		};
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(20px)", "translateY(0px)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 400,
				fill: "both",
				easing:'cubic-bezier(.5, 1.25, .75, 1.25)'
			}
		);
		statusAnimation.onfinish = () => {
			statusAnimation.commitStyles();
			statusAnimation.cancel();
		};
		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["scale(1.08)", "scale(1)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 400,
				fill: "both",
				easing:'cubic-bezier(.5, 1, .75, 1.25)'
			}
		);
		videoContainerAnimation.onfinish = () => {
			videoContainerAnimation.commitStyles();
			videoContainerAnimation.cancel();
		};
		const bottomControllerAnimation = bottomControllerRef.animate(
			{
				transform: ["translateY(-30px) scale(1.08)", "translateY(0px) scale(1)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 400,
				easing:'cubic-bezier(.5, .75, .75, 1.25)',
				fill: "both",
			}
		);
		bottomControllerAnimation.onfinish = () => {
			bottomControllerAnimation.commitStyles();
			bottomControllerAnimation.cancel();
		};
	});
	const onExit = () => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 300,
				fill: "both",
				easing:'cubic-bezier(.3, 0, .7, 1)'
			}
		);
		overlayAnimation.onfinish = () => overlayAnimation.cancel();
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing:'cubic-bezier(.1, 0, .9, 1)'
			}
		);
		panelAnimation.onfinish = () => panelAnimation.cancel();
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(0px)", "translateY(20px)"],
				opacity: [1,0.9,0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing:'cubic-bezier(0, 0, .3, 1)'
			}
		);
		statusAnimation.onfinish = () => statusAnimation.cancel();
		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["scale(1)", "scale(0)"],
				opacity: [1, 0.45,0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing:'cubic-bezier(.5, -.5, .1, 1.5'
			}
		);
		videoContainerAnimation.onfinish = () => videoContainerAnimation.cancel();
		const bottomControllerAnimation = bottomControllerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(-60px) scale(0)"],
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				easing:'cubic-bezier(.5, -.9, .1, 1.5)',
				fill: "both",
			}
		);
		bottomControllerAnimation.onfinish = () => bottomControllerAnimation.cancel();
		props.setBlobURL(mediaBlobUrl());
	}	
	return (
		<section
			role="dialog"
			aria-modal="true"
			x-id="['modal-title']"
			aria-labelledby="$id('modal-title')"
			class="overflow-y-auto fixed inset-0 z-50">
			{/* <!-- Overlay --> */}
			<div
				// x-show="isOpen"
				ref={(el: HTMLDivElement) => (overlayRef = el)}
				// x-transition.opacity.duration.500ms
				class="fixed inset-0 bg-slate-700/20 backdrop-blur-sm"></div>
			{/* <!-- Panel --> */}
			<div
				x-show="isOpen"
				ref={(el: HTMLDivElement) => (panelRef = el)}
				// x-on:click={`() => { ${makeNavClose()}}`}
				class="flex relative flex-col justify-center items-center min-h-screen max-h-screen px-12">
				<div ref={(el) => statusRef = el} class="w-full text-white pl-5 py-3">
					<h1>Status {status()}</h1>
				</div>
				<main
					// x-on:click.stop
					// x-trap.noscroll.inert="isOpen"
					ref={(el: HTMLElement) => (videoContainerRef = el)}
					id="dialog-container"
					class="
							w-full
							bg-white
							shadow-2xl
							shadow-[rgba(96,165,250,0.05)]
							backdrop-blur-xl
							rounded-2xl
							grow
							overflow-y-auto
							flex items-center justify-center
							overflow-x-hidden
								  ">
					<Switch
						fallback={
							<video
								ref={(el) => {
									previewRef = el;
								}}
								class="w-auto h-full rounded-xl"
								autoplay
							/>
						}>
						<Match when={mediaBlobUrl()}>
							<video class="w-auto h-full rounded-xl" src={mediaBlobUrl()} controls autoplay loop />
						</Match>
					</Switch>
				</main>
				<Show
					when={!isStopped()}
					fallback={
						<div ref={(el: HTMLDivElement) => (bottomControllerRef = el)} class="bg-white flex items-center px-2 py-1.5 my-4 rounded-lg">
							<TickBtn onClick={() => {
								onExit();
								setTimeout(() => {
									props.closeEvent();
								}, 500);
							}} />
							<span class="text-2xl text-[#001936] font-semibold leading-6 pl-1 pr-3">Done</span>
							<XBtn
								onClick={() => {
									onExit();
									setTimeout(() => {
										props.closeEvent();
									}, 500);
								}}
							/>
						</div>
					}>
					<div
						ref={(el: HTMLDivElement) => (bottomControllerRef = el)}
						class="bg-white flex items-center px-2 py-1.5 my-4 rounded-lg">
						<PlayButton
							state={isRecording}
							setState={setRecording}
							onClick={() => {
								!isRecording() ? (status() !== "paused" ? startRecording() : resumeRecording()) : pauseRecording();
							}}
						/>
						<span class="text-2xl text-[#001936] font-semibold leading-6 pl-1 pr-3">
							{status() === "idle" ? "record" : status()}
						</span>
						<StopBtn
							onClick={() => {
								stopRecording();
								setStopped(true);
								console.log("Clicked");
							}}
						/>
					</div>
				</Show>
			</div>
		</section>
	);
};
/* 
<section
	x-show="isOpen"
	x-cloak
	x-on:keydown.escape.prevent.stop={makeNavClose()}
	role="dialog"
	aria-modal="true"
	x-id="['modal-title']"
	x-on:keydown.ctrl.slash.window={`()=>{
		if( isNavOpen ) {
			${makeNavClose()}
		}else{
			${makeNavOpen()}
		}
	}`}
	:aria-labelledby="$id('modal-title')"
	class="overflow-y-auto fixed inset-0 z-50"
>
	<!-- Overlay -->
	<div
		x-show="isOpen"
		x-transition.opacity.duration.500ms
		class="fixed inset-0 bg-lime-400/20 dark:bg-green-400/10 backdrop-blur-sm"
	>
	</div>

	<!-- Panel -->
	<div
		x-show="isOpen"
		x-on:click={`() => { ${makeNavClose()}}`}
		class="flex relative justify-center items-center p-4 min-h-screen"
	>
		<main
			x-on:click.stop
			x-trap.noscroll.inert="isOpen"
			id="nav-dialog-container"
			class="
                p-10
				w-full
				container
                dark:bg-[hsl(206,100%,18%)]/40
                bg-green-500/40
                shadow-2xl
				shadow-green-300/10
				dark:shadow-[rgba(96,165,250,0.05)]
				backdrop-blur-xl
                rounded-xl
                max-h-96 
				overflow-y-auto
				overflow-x-hidden
              "
		>
			<section
				class="grid grid-cols-1 gap-y-8 sm:gap-y-0 sm:gap-x-8 place-content-center sm:grid-cols-2"
			>
				<ul class="flex flex-col gap-y-6 justify-center sm:gap-y-12">
					<ItemSection title="Navigation" {titleColor}>
						<Item link="/" notation="Home" bg="from-transparent to-slate-600/10" >
							<canvas x-rive.artboard.home width="79" height="79"></canvas>
						</Item>
						<Item
							link="/profile"
							notation="Resume"
							bg="from-transparent to-slate-600/10 sm:from-white sm:to-green-200"
						>
							<canvas x-rive.artboard.projects width="51.5475" height="79.435862069"></canvas>
							<!-- <canvas class="hidden sm:block" id="notesIcon" width="51.5475" height="79.435862069"></canvas> -->
						</Item>
						<Item
							link="/"
							notation="Notes"
							bg="from-transparent to-slate-600/10"
						>
							<canvas x-rive.artboard.notes width="51" height="79"></canvas>
						</Item>
						<Item
							link="/"
							notation="Chat"
							bg="from-transparent to-slate-600/10"
						>
							<canvas
								x-rive.artboard.chat
								width="64"
								height="64"></canvas>
							<!-- <canvas class="hidden sm:block" id="msgIcon" width="63.99" height="63.99"></canvas> -->
						</Item>
					</ItemSection>
				</ul>
				<ul class="flex flex-col gap-y-6 sm:gap-y-12">
					<PostSection title="Recent Posts" {titleColor}>
						<Post
							link="/post"
							title="Recently, updates from"
							notation="Astro, Nuxt, Next, Angular, Vue, React, tailwindcss ..."
							imgSrc="/assets/mesh-gradient.jpg"
						/>
					</PostSection>
				</ul>
				<button
					type="button"
					x-on:click={`() => { ${makeNavClose()}}`}
					class="hidden group absolute top-10 right-10 justify-center p-0.5 text-sm font-medium rounded-md border border-transparent sm:inline-flex focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 navItem bg-slate-100 ring-offset-rose-700 hover:bg-white focus-visible:ring-rose-600"
				>
					<span class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="
							h-6 w-6 
							text-cyan-800
							group-hover:opacity-0 group-hover:scale-0 
              group-focus:opacity-0 group-focus:scale-0 
							transition-[opacity,transform] duration-700"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="absolute h-5 w-5
								text-rose-500
								opacity-0 scale-50 top-0.5 left-0.5
							 	group-hover:opacity-100 group-hover:scale-100
                group-focus:opacity-100 group-focus:scale-100
								transition-[opacity,transform] duration-700"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"></path>
						</svg>
					</span>
				</button>
			</section>
		</main>
	</div>
</section>
*/
// export default App;
