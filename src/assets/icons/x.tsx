import { Show, ComponentProps, PropsWithChildren } from "solid-js";
import { Make_a_OutlineCircle_Around_Icon, Made_a_Solid_Circle_Around_Icon, MakeIconBtn } from "./utils";

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>;
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline";
};

type IconOptions = SvgWithIconsOptions<SvgOptions>;

export const XIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
				</Made_a_Solid_Circle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

export const XBtn = (props: ComponentProps<"button">) => {
	return (
		<MakeIconBtn
			colors={{
				fill: "#e11d48",
				stroke: "#FFF",
			}}
			icon={{
				hovered: XIcon,
				unhover: XIcon,
			}}
			width={40}
			height={40}
			{...props}
		/>
	);
};
