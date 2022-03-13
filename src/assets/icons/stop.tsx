import { Show, ComponentProps, PropsWithChildren, splitProps } from "solid-js";
import { Make_a_OutlineCircle_Around_Icon, Made_a_Solid_Circle_Around_Icon, MakeIconBtn } from "./utils";

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>;
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline";
};

type IconOptions = SvgWithIconsOptions<SvgOptions>;

export const StopIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<rect stroke-linecap="round" stroke-linejoin="round" x="3" y="3" rx="3" ry="3" width="14" height="14" stroke-width={3} />
					{/* <path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
						clip-rule="evenodd"
					/> */}
				</Made_a_Solid_Circle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				{/* <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> */}
				<rect stroke-linecap="round" stroke-linejoin="round" x="5" y="5" rx="3" ry="3" width="14" height="14" stroke-width={3} />
				{/* <path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
				/> */}
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

export const StopBtn = (props: ComponentProps<"button">) => {
	return (
		<MakeIconBtn
			colors={{
				fill: "#FF0060",
				stroke: "#FFF",
			}}
			icon={{
				hovered: StopIcon,
				unhover: StopIcon,
			}}
			width={40}
			height={40}
			{...props}
		/>
	);
};
