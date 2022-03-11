let chunks: BlobPart[] = [];

export const onComplete = (stream: MediaStream, soundClipsContainer: HTMLElement) => {	
	const mediaRecorder = new MediaRecorder(stream);
	const record = () => {
		mediaRecorder.start();
		console.log(mediaRecorder.state);
		console.log("recorder started");
		//   record.style.background = "red";

		//   stop.disabled = false;
		//   record.disabled = true;
	};

	const stop = () => {
		mediaRecorder.stop();
		console.log(mediaRecorder.state);
		console.log("recorder stopped");
		//   record.style.background = "";
		//   record.style.color = "";
		// mediaRecorder.requestData();

		//   stop.disabled = true;
		//   record.disabled = false;
	};
	
	mediaRecorder.onstop = function (e) {
		console.log("data available after MediaRecorder.stop() called.");

		const clipName = prompt("Enter a name for your sound clip?", "My unnamed clip");

		const clipContainer = document.createElement("article");
		const clipLabel = document.createElement("p");
		const audio = document.createElement("audio");
		const deleteButton = document.createElement("button");

		clipContainer.classList.add("clip");
		audio.setAttribute("controls", "");
		deleteButton.textContent = "Delete";
		deleteButton.className = "delete";

		if (clipName === null) {
			clipLabel.textContent = "My unnamed clip";
		} else {
			clipLabel.textContent = clipName;
		}

		clipContainer.appendChild(audio);
		clipContainer.appendChild(clipLabel);
		clipContainer.appendChild(deleteButton);
		soundClipsContainer.appendChild(clipContainer);

		audio.controls = true;
		const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
		chunks = [];
		const audioURL = window.URL.createObjectURL(blob);
		audio.src = audioURL;
		console.log("recorder stopped");

		deleteButton.onclick = function (e:MouseEvent) {
			let evtTgt = e.target;
			evtTgt?.parentNode.parentNode.removeChild(evtTgt.parentNode);
		};
		
		clipLabel.onclick = function () {
			const existingName = clipLabel.textContent;
			const newClipName = prompt("Enter a new name for your sound clip?");
			if (newClipName === null) {
				clipLabel.textContent = existingName;
			} else {
				clipLabel.textContent = newClipName;
			}
		};
	};
	mediaRecorder.ondataavailable = function (e) {
		chunks.push(e.data);
	};
	return {
		record,
		stop,
	}
};
