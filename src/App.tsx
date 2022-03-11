import { VideoPreview } from "./VideoPreview";
import { createEffect, createSignal, on } from "solid-js";
import { PlayButton } from "./assets/icons/play";
import FileUpload from "./components/FileUpload";
import {RecordView} from "./RecordView";
import type { Component } from "solid-js";
import { RecordAudio } from "./RecordAudio";

const App: Component = () => {
	const mimeType = "audio/webm"	
	return (
		<div class="w-full bg-slate-900 flex flex-col">
			<section class="w-full h-full flex flex-col items-center gap-y-48">
				<VideoPreview />
				<RecordView/>
				<RecordAudio/>
				{/* <PlayButton  /> */}
			</section>
		</div>
	);
};

export default App;

				{/* <button ref={(el) => (recordRef = el)} onClick={() => {
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
				</button> */}
				{/* <div ref={(el) => (soundClips = el)} onClick={stop} ></div> */}
