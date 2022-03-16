import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePlus, HiOutlineSelector, HiOutlineTrash } from "solid-icons/hi";
import { ComponentProps, splitProps } from "solid-js";

type StateIconsOptions<P = {}> = P & {
	isActive: boolean;
};

export const AccordionIndicatorIcon = (props: StateIconsOptions<ComponentProps<'svg'>>) => {
	const [local,others] = splitProps(props,['isActive']);
	return (
		// <HiOutlineChevronRight class={"w-4 h-4 pr-1 will-change-transform transition-transform "+(props.isActive.isopen ? 'rotate-90' : 'rotate-0')} {...props} />
		<svg xmlns="http://www.w3.org/2000/svg" class={"h-4 w-4 transition-transform "+(local.isActive ? ' rotate-90' : 'pr-1 rotate-0')} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" {...others} >
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		</svg>
	);
};

type BtnProps = ComponentProps<"button">;


export const AddBtn = (props: BtnProps) => (
	<button title="Add File" {...props}>
		<HiOutlinePlus class="w-5 h-5" />
	</button>
);

export const DeleteBtn = (props: BtnProps) => (
	<button {...props}>
		<HiOutlineTrash class="w-5 h-5" />
	</button>
);

export const ReorderBtn = (props: BtnProps) => (
	<button {...props}>
		<HiOutlineSelector class="w-5 h-5" />
	</button>
);
