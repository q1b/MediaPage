import { Component } from "solid-js";

const FileUpload: Component<any> = (props) => {
	let fileInputL: HTMLInputElement;

	const hadleClick = () => {
		fileInputL.click();
	};

	const onChange = (e: any) => {
		if (props.onChange) {
			props.onChange(e);
		}
	};

	const customClass = props.children ? props.children : "";
	const accept = props.accept ? props.accept : "*";
	return (
		<div class="absolute z-10 pt-2 pl-2">
			<button
				type="button"
				disabled={props.disabled}
				onClick={hadleClick}
				class={`text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ${customClass} disabled:opacity-5`}>
				{props.children ? props.children : "Upload"}
			</button>
			<button onClick={hadleClick}></button>
			<input ref={(el: HTMLInputElement) => (fileInputL = el)} type="file" hidden onChange={onChange} accept={accept} />
		</div>
	);
};
export default FileUpload;
