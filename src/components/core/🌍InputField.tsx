import { ComponentProps, createSignal,splitProps, PropsWithChildren, onMount, onCleanup } from "solid-js";
import { InsertBeforeApp } from "./InsertBefore";

// want to write it's name'🌍
export const [inputValue, setInputValue] = createSignal("");

type InputProps<P = {}> = P & {
	placeholder?: string;
	onDone:() => void;
	onClose?: () => void;
}

export const InputField = (props: InputProps<PropsWithChildren<ComponentProps<'input'>>> ) => {
	const [local,other] = splitProps(props,['onDone','onClose','placeholder']);
	let inputRef: HTMLInputElement;
	let keyDownHandler = (e:KeyboardEvent)=>{
			if(document.activeElement !== inputRef) {
				inputRef.focus();
			}
			if(e.key === 'Enter') {
				local.onDone();
			}
		};
	onMount(()=>{
		window.addEventListener('keydown',keyDownHandler);
		onCleanup(()=>{
			// console.log("I am removed");
			window.removeEventListener('keydown',keyDownHandler);
		})
	})
	return (
		<InsertBeforeApp>
			<div class="absolute z-10 flex items-center justify-end bg-slate-800">
				<input
					// class="bg-transparent text-slate-800 focus:outline-none focus:bg-white focus:scale-105 focus:-translate-x-1 rounded-l-lg pl-1"
					class="w-full bg-transparent placeholder:text-slate-500 text-white focus:outline-none pl-1"
					placeholder={local.placeholder||"rename"}
					type="text"
					ref={(el) => {
						inputRef = el;
						// @ts-ignore
						props.ref(el);
					}}
					onInput={(e) => {
						setInputValue(e.currentTarget.value);
					}}
					value={inputValue()}
				/>
				<button onClick={local.onDone} class="bg-slate-200 hover:bg-white hover:scale-110 hover:text-green-500 p-0.5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
						/>
					</svg>
				</button>
			</div>
		</InsertBeforeApp>
	);
};
