import { PlayButton } from "./assets/icons/play";
import videoURL from "./assets/vi.mp4";
import { createEffect, createSignal } from "solid-js";
import { RemoveBtn } from "./assets/icons/remove";

export const VideoPreview = (props:any) => {
	let videoRef: HTMLVideoElement;
	const [isPlaying, setPlayingState] = createSignal<boolean>(false);
	const [progress, setProgess] = props.progressState;
	const [speed, setSpeed] = createSignal<number>(1);
	const [isMuted, setMutedState] = createSignal<boolean>(false);

	const togglePlay = () => {
		setPlayingState(!isPlaying());
	};

	createEffect(() => {
		isPlaying() ? videoRef.play() : videoRef.pause();
	});

	const handleOnTimeUpdate = () => {
		const progress = (videoRef.currentTime / videoRef.duration) * 100;
		console.log("duration",videoRef.duration);
		if (progress) setProgess(progress);
	};

	const handleVideoProgress = (event: any) => {
		const manualChange = Number(event.target.value);
		videoRef.currentTime = (videoRef.duration / 100) * manualChange;
		setProgess(manualChange);
	};

	const handleVideoSpeed = (event: any) => {
		const speed = Number(event.target.value);
		videoRef.playbackRate = speed;
		setSpeed(speed);
	};

	const toggleMute = () => {
		setMutedState(!isMuted());
	};

	createEffect(() => {
		isMuted() ? (videoRef.muted = true) : (videoRef.muted = false);
	});
	return (
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-white text-3xl font-bold uppercase">Video Preview Example</h1>
			<section class="flex items-center justify-center w-96 h-96">
				<video
					preload="auto"
					ref={(el) => {
						videoRef = el;
						props.ref(el)
					}}
					onTimeUpdate={handleOnTimeUpdate}
					class="w-full h-full"
					src={videoURL}
					controls
				/>
			</section>
			<section class="w-full flex gap-x-4 mt-2"></section>
			<section class="flex flex-col items-center">
				<article class="w-max">
					<PlayButton
						onClick={() => {
							togglePlay();
						}}
					/>
				</article>
				<article class="text-white">
					Progress
					<span>{progress()}</span>
				</article>
				<input type="range" min="0" max="100" value={progress()} onChange={handleVideoProgress} />
			</section>
		</div>
	);
};
