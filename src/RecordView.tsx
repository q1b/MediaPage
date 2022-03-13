import { createSignal, Switch, Match, createReaction, createEffect } from "solid-js";
import { useReactMediaRecorder, StatusMessages } from "./mediaRecorder";
import { PlayButton } from "./assets/icons/microphone";
import { RemoveBtn } from "./assets/icons/remove";
import { StopBtn } from "./assets/icons/stop";


export const RecordView = () => {
	let previewRef: HTMLVideoElement;
	const [isplaying, setIsPlaying] = createSignal(false);
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
				setIsPlaying(true);
				break;
			case "idle":
				track(() => mediaStream());
				break;
			default:
				setIsPlaying(false);
				break;
		}
	});
	return (
		<div class="flex flex-col items-center justify-center">
			<h1 class="text-white text-3xl font-bold uppercase">{status}</h1>
			{/* <PlayButton /> */}
			<section class="flex items-center justify-center w-96 h-96">
				<Switch
					fallback={
						<video
							ref={(el) => {
								previewRef = el;
							}}
							class="w-full h-full"
							width={500}
							height={500}
							autoplay
						/>
					}>
					<Match when={mediaBlobUrl()}>
						<video class="w-full h-full" src={mediaBlobUrl()} controls autoplay loop />
					</Match>
				</Switch>
			</section>
			<section class="w-full flex gap-x-4 mt-2">
				<PlayButton
					state={isplaying}
					setState={setIsPlaying}
					onClick={() => {
						!isplaying() ? (
							status() !== "paused" ? startRecording() : resumeRecording()
						) : pauseRecording();
					}}
				/>
				<StopBtn onClick={stopRecording} />
				<RemoveBtn onClick={clearBlobUrl} />
				{/* <RightArrowBtn/> */}
			</section>
		</div>
	);
};
