import { createEffect, on, createSignal, onMount, Switch, Match, createReaction } from "solid-js";
import { useReactMediaRecorder } from "./mediaRecorder";
import { PlayButton } from "./assets/icons/microphone";

export const RecordView = () => {
	const [previewStream, setPreviewStream] = createSignal();
	let previewRef: HTMLVideoElement;

	const track = createReaction(() => {
		let stream = new MediaStream(mediaStream()?.getVideoTracks());
		if (previewRef && stream) previewRef.srcObject = stream;
		setPreviewStream(stream);
	})

	const { 
		status,
		startRecording,
		stopRecording,
		resumeRecording,
		pauseRecording,
		clearBlobUrl,
		mediaBlobUrl,
		mediaStream,
	} = useReactMediaRecorder({
			video: true,
		});

	track(() => mediaStream());
	
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
				<button
					class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none"
					onClick={startRecording}>
					Start Recording
				</button>
				<button
					class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none"
					onClick={pauseRecording}>
					Pause Recording
				</button>
				<button
					class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none"
					onClick={resumeRecording}>
					Resume Recording
				</button>
				<button
					class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none"
					onClick={stopRecording}>
					Stop Recording
				</button>
				<button
					class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none"
					onClick={clearBlobUrl}>
					Clear Recording
				</button>
			</section>
		</div>
	);
};
